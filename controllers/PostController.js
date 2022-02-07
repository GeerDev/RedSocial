const { config } = require('npm');
const Post = require('../models/Post.js');
const User = require('../models/User.js');

const PostController = {
    async create(req,res,next){
        try {
            const post = await Post.create({...req.body, userId: req.user._id, reviews:  { userId: req.user._id }})
            await User.findByIdAndUpdate(req.user._id, { $push: { postsIds: post._id } })
            res.status(201).send(post)
        } catch (error) {
            error.origin = 'posts'
            next(error)
        }
    },
    async update(req, res) {
        try {
          const post = await Post.findByIdAndUpdate(req.params._id, req.body, { new: true })
          res.send({ message: "Post actualizado correctamente", post });
        } catch (error) {
          console.error(error);
          res.status(500).send({ message: 'Ha habido un problema al actualizar el post' })
        }
      },
    async delete(req, res) {
        try {
            const post = await Post.findByIdAndDelete(req.params._id)
            res.send({ post, message: 'Post eliminado' })
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: 'Ha habido un problema al eliminar el post' })
        }
    },
    async getAll(req, res) {
        try {
           const { page = 1, limit = 10 } = req.query;
           const posts = await Post.find()
           .populate("reviews.userId")
           .limit(limit)
           .skip((page - 1) * limit);
           res.send(posts)
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Ha habido un problema al traer los posts' })
        }
    },
    async getById(req, res) {
        try {
            const post = await Post.findById(req.params._id)
            res.send(post)
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Ha habido un problema al traer el post por Id' })
        }
    },
    async getByTitle(req, res) {
        try {
            const post = await Post.aggregate([{
                    $match: {
                        title:req.params.title
                    }
                }, ])
                res.send(post)
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: 'Ha habido un problema al traer el post por título' })
        }
    },
    async insertReview(req, res) {
        try {
          const post = await Post.findByIdAndUpdate(
            req.params._id,
            { $push: { reviews: { ...req.body, userId: req.user._id } } },
            { new: true }
          );
          res.send(post);
        } catch (error) {
          console.error(error);
          res.status(500).send({ message: "Ha habido un problema a la hora de crear la review" });
        }
      },
    async like(req, res) {
        try {
          const found = await Post.findById(req.params._id);
          if ( !found.likes.includes(req.user._id)) {
            const post = await Post.findByIdAndUpdate(
                req.params._id,
                { $push: { likes: req.user._id } },
                { new: true }
              );
              await User.findByIdAndUpdate(
                req.user._id,
                { $push: { favorites: req.params._id } },
                { new: true }
              );
              res.send(post);
          } else {
            res.status(400).send({ message: "No se puede dar like otra vez" });
          }
        } catch (error) {
          console.error(error);
          res.status(500).send({ message: "Ha habido un problema a la hora de darle al like" });
        }
      },
      async dislike(req, res) {
        try {
            const post = await Post.findByIdAndUpdate(
                req.params._id,
                { $pull: { likes: req.user._id } },
                { new: true }
              );
              await User.findByIdAndUpdate(
                req.user._id,
                { $pull: { favorites: req.params._id } },
                { new: true }
              );
              res.send(post);
        } catch (error) {
          console.error(error);
          res.status(500).send({ message: "Ha habido un problema a la hora de darle al dislike" });
        }
      },
      async getAllLikesWithUsers(req, res) {
        try {
           const posts = await Post.find()
           .populate("userId", "name")
           .populate("reviews.userId")
           res.send(posts)
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Ha habido un problema al traer los posts' })
        }
    },
    async updateReview(req, res) {
        try {
          const review = await Post.findByIdAndUpdate(req.params._id, {reviews: req.body}, { new: true })
          res.send({ message: "Review actualizada correctamente", review });
        } catch (error) {
          console.error(error);
          res.status(500).send({ message: 'Ha habido un problema al actualizar la review' })
        }
      },
    async deleteReview(req, res) {
        try {
            const post = await Post.findByIdAndUpdate(req.params._id,  {
                $pull: { reviews: {_id: req.body._id}},
              })
            res.send({ post, message: 'Review eliminada' })
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: 'Ha habido un problema al eliminar la review' })
        }
    },
    async likeComment(req, res) {
        try {
          const post = await Post.findById(req.params._id);
          for (const element of post.reviews) {
              console.log(element);
              if ((element._id.toString() === req.body._id) && !element.likes.includes(req.user._id)) {
                    element.likes.push(req.user._id)
                    await post.save()
                // Para ver con la Profe
                //  await post.updateOne(
                //     { $push: { element : {likes: req.user._id }} },
                //     { new: true }
                //   );
              } else {
                res.status(400).send({ message: "No se puede dar like otra vez a la review" });
              }
          }
          res.send(post);
        } catch (error) {
          console.error(error);
          res.status(500).send({ message: "Ha habido un problema a la hora de darle al like a la review" });
        }
      },
      async dislikeComment(req, res) {
        try {
            const post = await Post.findById(req.params._id);
            for (const element of post.reviews) {
                if ((element._id.toString() === req.body._id) && element.likes.includes(req.user._id)) {
                    const search = element.likes.indexOf(req.user._id)
                    element.likes.splice(search, 1)
                    await post.save()
                } else {
                  res.status(400).send({ message: "No se puede dar dislike otra vez a la review" });
                }
            }
            res.send(post);
        } catch (error) {
          console.error(error);
          res.status(500).send({ message: "Ha habido un problema a la hora de darle al dislike" });
        }
      },


}

module.exports = PostController