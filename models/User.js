const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es obligatorio']
    },
    password: {
        type: String,
        required: true
    },
    role: String,
    image: String,

    tokens: [],
    confirmed: Boolean,
    google: Boolean,

    postsIds: [{ type: ObjectId, ref: 'Post' }],
    favorites: [{type: ObjectId, ref: 'Post' }],

    followers: [{ type: ObjectId, ref: 'User' }],
    followings: [{ type: ObjectId, ref: 'User' }]

}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;