const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    spotifyLink: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    image: {
        type: Object,
        required: true,
    },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;