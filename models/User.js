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

    postsIds: [{ type: ObjectId, ref: 'Post' }],
    likes: [{type: ObjectId, ref: 'Post' }]

}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;