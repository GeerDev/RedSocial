const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require("../config/nodemailer");

const UserController = {
    async register(req, res, next) {
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
            const newUser = await User.create({...req.body, password: hash, role: 'user', confirmed: false });

            const emailToken = jwt.sign({email:req.body.email}, process.env.JWT_SECRET, {expiresIn:'48h'})
            const url = 'http://localhost:4000/users/confirm/' + emailToken
            await transporter.sendMail({
                to: req.body.email,
                subject: "Confirme su registro",
                html: `<h3>Bienvenido, estás a un paso de registrarte </h3>
                <a href="${url}"> Click para confirmar tu registro</a>
                `,
            },(error) => {
                    if (error){
                        res.status(500).send(error.message);
                    } else {
                        res.status(200).jsonp(req.body);
                    }
              });
        

            res.status(201).send({
                newUser
            });
        } catch (error) {

            error.origin = 'users'
            next(error)
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

            if (!user.confirmed) {
                return res.status(400).send({ message: "Debes confirmar tu correo" });
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
    async updateUser(req, res) {
        try {
            if (req.body.password) {
                const { password } = req.body

                const hash = await bcrypt.hash( password, 10)

                const userWithPassword = await User.findByIdAndUpdate(
                    req.params._id,
                    { ...req.body, rol: 'user', password: hash },
                    { new: true }
                  );
                return res.send({ message: "Usuario con cambio de contraseña actualizado con éxito", userWithPassword });
            }
            const user = await User.findByIdAndUpdate(
                req.params._id,
                { ...req.body, rol: 'user' },
                { new: true }
              );
            res.send({ message: "Usuario actualizado con éxito", user });
        } catch (error) {
            res.status(500).send({message:"Ha habido un problema al actualizar el usuario"})
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
            .populate("postsIds", "userId")
            .populate("followers", "name")
          res.send({user, numbersFollowers: user.followers.length});
        } catch (error) {
          console.error(error);
          res.status(500).send({ error, message: 'Hubo un problema al tratar de obtener la información del usuario' })
        }
      },
    async getById(req, res) {
        try {
            const user = await User.findById(req.params._id)
            res.send(user)
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Ha habido un problema al traer el usuario por Id' })
        }
    },
    async getByName(req, res) {
        try {
            const user = await User.aggregate([{
                    $match: {
                        name:req.params.name
                    }
                }, ])
                res.send(user)
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: 'Ha habido un problema al traer el usuario por título' })
        }
    },
    async confirm(req,res){
        try {
          const token = req.params.emailToken;
          console.log(token);
          const payload = jwt.verify(token, process.env.JWT_SECRET)
          const user = await User.findOne({ email: payload.email })
          await user.updateOne({confirmed:true})
          res.status(201).send("Usuario confirmado con exito" );
        } catch (error) {
          console.error(error)
        }
      },
    async recoverPassword(req, res) {
        try {
          const recoverToken = jwt.sign({ email: req.params.email }, process.env.JWT_SECRET, {expiresIn: "48h"});
          const url = "http://localhost:4000/users/resetPassword/" + recoverToken;
          await transporter.sendMail({
            to: req.params.email,
            subject: "Recuperar contraseña",
            html:   `<h3> Recuperar contraseña </h3>
                    <a href="${url}">Recuperar contraseña</a>
                    El enlace expirará en 48 horas
                    `,
          });
          res.send({
            message: "Un correo de recuperación se envio a tu dirección de correo",
          });
        } catch (error) {
          console.error(error);
        }
      },
    async resetPassword(req, res) {
        try {
          const recoverToken = req.params.recoverToken;
          const payload = jwt.verify(recoverToken, process.env.JWT_SECRET);

          const hash = await bcrypt.hash(req.body.password, 10)

          await User.findOneAndUpdate(
            { email: payload.email },
            { password: hash }
          );
          res.send({ message: "contraseña cambiada con éxito" });
        } catch (error) {
          console.error(error);
        }
      }  
}

module.exports = UserController