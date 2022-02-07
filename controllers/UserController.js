const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserController = {
    async register(req, res) {
        try {
            if (!req.body.password){
                return res.status(400).json({msg:'La contraseña es obligatoria'})
            } 
            const email = req.body.email;
            const user = await User.findOne({ email: email })
            if (user) {
                return res.status(400).send({ message: 'Este correo ya existe' });
            }
            const hash = await bcrypt.hash(req.body.password, 10)
            const newUser = await User.create({...req.body, password: hash, role: 'user' });
            res.status(201).send({
                newUser
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({ error, message: 'Hubo un problema al tratar de registar' })
        }
    },
    async login(req, res) {
        try {
            if(!req.body.password || !req.body.email){
                return res.status(400).json({msg:'Por favor rellene los campos que faltan'})
            }

            const user = await User.findOne({
                email: req.body.email
            }) 
    
            if (!user) {
                return res.status(400).send({ message: 'Contraseña o nombre incorrectos' });
            }
            const isMatch = await bcrypt.compare(req.body.password, user.password)

            if (!isMatch) {
                return res.status(400).send({ message: 'Contraseña o nombre incorrectos' });
            }
            
            token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
            if (user.tokens.length > 3) user.tokens.shift();
            user.tokens.push(token);
            await user.save();

            res.send({ message: 'Bienvenid@ ' + user.name, token });

        } catch (error) {
            console.error(error);
            res.status(500).send({ error, message: 'Hubo un problema al tratar de hacer el logeo' })
        }
    },
    async logout(req, res) {
        try {
          await User.findByIdAndUpdate(req.user._id, {
            $pull: { tokens: req.headers.authorization },
          });
          res.send({ message: "Desconectado con éxito" });
        } catch (error) {
          console.error(error);
          res.status(500).send({
            message: "Hubo un problema al intentar conectar al usuario",
          });
        }
      },
    async follow(req, res) {
        if (req.user._id !== req.params._id){
            try {
                const targetUser = await User.findById(req.params._id)
                const currentUser = await User.findById(req.user._id)
                if (!currentUser.followings.includes(req.params._id)) {
                    await targetUser.updateOne ({ $push: { followers: req.user._id } })
                    await currentUser.updateOne ({ $push: { followings: req.params._id } })
                    res.status(200).send({ message: "Usuario seguido con exito" })
                }
                else {
                    res.status(403).send({ message: "¡Ya sigues a este usuario!" })
                }
            } catch (error) {
                res.status(500).send({ message: "Ha habido un problema intentando seguir al usuario" })
            }
        }
        else {
            res.status(400).send({ message: "No puedes seguirte a ti mismo" })
        }
    },
    async unfollow(req, res) {
        if (req.user._id !== req.params._id){
            try {
                const targetUser = await User.findById(req.params._id)
                const currentUser = await User.findById(req.user._id)
                if (currentUser.followings.includes(req.params._id)) {
                    await targetUser.updateOne ({ $pull: { followers: req.user._id } })
                    await currentUser.updateOne ({ $pull: { followings: req.params._id } })
                    res.status(200).send({ message: "Has dejado de seguir al usuario con éxito" })
                }
                else {
                    res.status(403).send({ message: "¡No puedes dejar de seguir si aún no sigues al usuario!" })
                }
            } catch (error) {
                res.status(500).send({ message: "Ha habido un problema al intentar dejar de seguir al usuario" })
            }
        }
        else {
            res.status(400).send({ message: "No puedes dejar de seguirte a ti mismo" })
        }
    },
    async getInfoUserPost(req, res) {
        try {
          const user = await User.findById(req.user._id)
            .populate("postsIds");
          res.send(user);
        } catch (error) {
          console.error(error);
          res.status(500).send({ error, message: 'Hubo un problema al tratar de obtener la información del usuario' })
        }
      },
    async getInfoUserPostFollowers(req, res) {
        try {

          const user = await User.findById(req.user._id)
            .populate("postsIds", "userId");
          res.send({user, numbersFollowers: user.followings.length});
        } catch (error) {
          console.error(error);
          res.status(500).send({ error, message: 'Hubo un problema al tratar de obtener la información del usuario' })
        }
      },
    
}

module.exports = UserController