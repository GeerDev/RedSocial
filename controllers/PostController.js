const Post = require('../models/Post.js');

const PostController = {
    async create(req,res){
        try {
            const post = await Post.create({...req.body, userId: req.user._id })
            res.status(201).send(post)
        } catch (error) {
            console.error(error)
            if(error.errors){
                res.status(400).send({ msg: error.errors.title.properties.message})
            }
            res.status(500).send({ message: 'Ha habido un problema al crear el post' })
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
           const posts = await Post.find()
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
    }




}

module.exports = PostController