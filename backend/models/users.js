const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    following: {
        type: [String],
        default: [],
    },
    followers: {
        type: [String],
        default: [],
    },
    bio: {
        type: String,
        default: '',
    },
    profilePicture: {
        type: String,
        default: '',
    },
    favoriteSong: {
        type: String,
        default: '',
    },
    posts: {
        type: [String],
        default: [],
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;