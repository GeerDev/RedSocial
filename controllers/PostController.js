const Post = require('../models/Post.js');

const PostController = {
    async create(req,res){
        try {
            const post = await Post.create({...req.body, userId: req.user._id })
            res.status(201).send(post)
        } catch (error) {
            console.error(error)
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
    
}

module.exports = PostController