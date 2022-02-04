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
    async getInfo(req, res) {
        try {
          const user = await User.findById(req.user._id).populate("postsIds");
          res.send(user);
        } catch (error) {
          console.error(error);
          res.status(500).send({ error, message: 'Hubo un problema al tratar de obtener la información del usuario' })
        }
      },
    async follow
    
}

module.exports = UserController