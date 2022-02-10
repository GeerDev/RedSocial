const Post = require("../models/Post.js");
const User = require("../models/User.js");

const PostController = {
  async create(req, res, next) {
    try {
      req.file ? req.body.image = req.file.filename : req.body.image = ''
      const post = await Post.create({ ...req.body, userId: req.user._id });
      await User.findByIdAndUpdate(req.user._id, {
        $push: { postsIds: post._id },
      });
      res.status(201).send(post);
    } catch (error) {
      error.origin = "posts";
      next(error);
    }
  },
  async update(req, res) {
    try {
      req.file ? req.body.image = req.file.filename : req.body.image = ''
      const post = await Post.findByIdAndUpdate(
        req.params._id,
        { ...req.body, userId: req.user._id },
        { new: true }
      );
      res.send({ message: "Post actualizado correctamente", post });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Ha habido un problema al actualizar el post" });
    }
  },
  async delete(req, res) {
    try {
      const post = await Post.findByIdAndDelete(req.params._id);
      await User.findByIdAndUpdate(post.userId, {
        $pull: { postsIds: {_id:req.params._id} },
      })
      res.send({ post, message: "Post eliminado" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Ha habido un problema al eliminar el post" });
    }
  },
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const posts = await Post.find()
        .populate("comments.userId")
        .limit(limit)
        .skip((page - 1) * limit);
      res.send({ posts, message: "Aquí tienes todos los posts" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Ha habido un problema al traer los posts" });
    }
  },
  async getById(req, res) {
    try {
      const post = await Post.findById(req.params._id);
      res.send(post);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Ha habido un problema al traer el post por Id" });
    }
  },
  async getByTitle(req, res) {
    try {
      const post = await Post.aggregate([
        {
          $match: {
            title: req.params.title,
          },
        },
      ]);
      res.send(post);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Ha habido un problema al traer el post por título" });
    }
  },
  async insertComment(req, res) {
    try {
      req.file ? req.body.image = req.file.filename : req.body.image = ''
      const post = await Post.findByIdAndUpdate(
        req.params._id,
        { $push: { comments: { ...req.body, userId: req.user._id } } },
        { new: true }
      );
      res.send(post);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({
          message: "Ha habido un problema a la hora de crear el comentario",
        });
    }
  },
  async like(req, res) {
    try {
      const existPost = await Post.findById(req.params._id);
      if (!existPost.likes.includes(req.user._id)) {
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
      res
        .status(500)
        .send({ message: "Ha habido un problema a la hora de darle al like" });
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
      res
        .status(500)
        .send({
          message: "Ha habido un problema a la hora de darle al dislike",
        });
    }
  },
  async getAllLikesWithUsers(req, res) {
    try {
      const posts = await Post.find()
        .populate("likes", "name")
      res.send(posts);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Ha habido un problema al traer los posts" });
    }
  },
  async updateComment(req, res) {
    try {
      req.file ? req.body.image = req.file.filename : req.body.image = ''
      const post = await Post.findByIdAndUpdate(req.params._id, {
        $pull: { comments: { _id: req.body._id } },
      });
      const comment = await Post.findByIdAndUpdate(
        post._id,
        { $push: { comments: { ...req.body, userId: post.userId, _id: req.body._id } } },
        { new: true }
      );
      res.send({ message: "Comentario actualizado correctamente", comment });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Ha habido un problema al actualizar el comentario" });
    }
  },
  async deleteComment(req, res) {
    try {
      const post = await Post.findByIdAndUpdate(req.params._id, {
        $pull: { comments: { _id: req.body._id } },
      });
      res.send({ post, message: "Comentario eliminado" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Ha habido un problema al eliminar el comentario" });
    }
  },
  async likeComment(req, res) {
    try {
      const post = await Post.findById(req.params._id);
      for (const element of post.comments) {
        if (element._id.toString() === req.body._id && !element.likes.includes(req.user._id)) {
          element.likes.push(req.user._id);
          await post.save();
        } else {
          res
            .status(400)
            .send({ message: "No se puede dar like otra vez a el comentario" });
        }
      }
      res.send(post);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({
          message:
            "Ha habido un problema a la hora de darle al like a el comentario",
        });
    }
  },
  async dislikeComment(req, res) {
    try {
      const post = await Post.findById(req.params._id);
      for (const element of post.comments) {
        if (element._id.toString() === req.body._id && element.likes.includes(req.user._id)) {
          const search = element.likes.indexOf(req.user._id);
          element.likes.splice(search, 1);
          await post.save();
        } else {
          res
            .status(400)
            .send({ message: "No se puede dar dislike otra vez a el comentario" });
        }
      }
      res.send(post);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({
          message: "Ha habido un problema a la hora de darle al dislike",
        });
    }
  }
};

module.exports = PostController;
