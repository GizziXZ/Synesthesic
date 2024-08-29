const mongoose = require('mongoose');
const { randomBytes } = require('crypto');
const { time } = require('console');

const postSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        default: randomBytes(16).toString('hex'),
    },
    title: {
        type: String,
        required: true,
    },
    spotifyLink: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Number,
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