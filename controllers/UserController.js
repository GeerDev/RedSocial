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
            const user = await User.findOne({
                name: req.body.name
            }) 

            res.send({user});

        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = UserController