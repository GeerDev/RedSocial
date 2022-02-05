const Post = require('../models/Post.js');
const User = require('../models/User.js');

const PostController = {
    async create(req,res,next){
        try {
            const post = await Post.create({...req.body, userId: req.user._id })
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
      async getAllLikeswithUsers(req, res) {
        try {
           const { page = 1, limit = 10 } = req.query;
           const posts = await Post.find()
           .populate("reviews.userId")
           .populate("favorites")
           .limit(limit)
           .skip((page - 1) * limit);
           res.send(posts)
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Ha habido un problema al traer los posts' })
        }
    }

}

module.exports = PostController