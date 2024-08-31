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
    notifications: {
        type: [
            {
                notificationCauser: String, // username of the user who caused the notification
                notificationType: String, // follow, like, comment
                link: String, // link to the post
                date: {
                    type: Date,
                    default: Date.now,
                },
            }
        ],
        default: [],
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