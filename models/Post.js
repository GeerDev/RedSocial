const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'El título es obligatorio']
    },
    description: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    image: {
        type: String
    },
    userId: {
        type: ObjectId,
        ref: 'User'
    },
    reviews: [{
        userId: { type: ObjectId, ref: 'User' },
        comment: String,
        image: String,
        likes: [{type: ObjectId, ref: 'User' }]
    }],
    likes: [{type: ObjectId, ref: 'User' }]
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;