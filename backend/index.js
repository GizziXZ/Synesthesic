const express = require('express');
const config = require('./config.json');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/users');
const Post = require('./models/posts');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const cors = require('cors');

mongoose.connect(config.mongooseConnection + 'Synesthesic', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get('/notifications', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!jwt.verify(token, config.secret)) return res.status(401).send('Invalid token');
        const user = await User.findOne({ username: jwt.decode(token, config.secret).username });
        const notifications = user.notifications;
        res.status(200).json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

app.get('/profile/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }, { password: 0, _id: 0 });
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

app.get('/posts', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const posts = await Post.find().skip(skip).limit(limit);
        const totalPosts = await Post.countDocuments();
        const hasMore = skip + posts.length < totalPosts;

        res.status(200).json({ posts, hasMore });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

app.get('/posts/:username', async (req, res) => {
    try {
        const posts = await Post.find({ username: req.params.username });
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

app.get('/post/:id', async (req, res) => {
    try {
        const post = await Post.findOne({ id: req.params.id });
        res.status(200).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

app.get('/following', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!jwt.verify(token, config.secret)) return res.status(401).send('Invalid token');
        const user = jwt.decode(token, config.secret).username;
        const following = await User.findOne({ username: user }, { following: 1, _id: 0 });
        res.status(200).json(following);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

app.get('/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).send('Query parameter is required');
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const regex = new RegExp(query, 'i'); // 'i' makes it case-insensitive
        const search = { $or: [{ title: regex }, { username: regex }] }; // $or is a MongoDB operator, so we're using it here to search for either the title or the username

        const posts = await Post.find(search).skip(skip).limit(limit);
        const totalPosts = await Post.countDocuments(search);
        const hasMore = skip + posts.length < totalPosts;

        res.status(200).json({ posts, hasMore });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

app.get('/liked-posts', async (req, res) => {
    try { // might have to do the pages thing here too
        const token = req.headers.authorization.split(' ')[1];
        if (!jwt.verify(token, config.secret)) return res.status(401).send('Invalid token');
        const user = jwt.decode(token, config.secret).username;
        const posts = await Post.find({ likedBy: user });
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

app.get('/profile/:username/followers', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }, { followers: 1, _id: 0 });
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

app.get('/profile/:username/following', async (req, res) => { // same as above
    try {
        const user = await User.findOne({ username: req.params.username }, { following: 1, _id: 0 });
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

app.post('/register', async (req, res) => {
    if (await User.findOne({ username: req.body.username })) {
        return res.status(400).send('User already exists');
    }
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });

    await newUser.save();
    res.status(201).send();
});

app.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(400).send('User not found');

    if (await bcrypt.compare(req.body.password, user.password)) {
        const token = jwt.sign({ username: user.username }, config.secret, { expiresIn: '4h' });
        res.cookie('token', token, { httpOnly: true }).status(200).json({token});
    } else {
        res.status(401).send('Invalid password');
    }
});

app.post('/post', upload.fields([{name: 'title', maxCount: 1}, {name: 'spotifyLink', maxCount: 1}, {name: 'timestamp', maxCount: 1}, {name: 'image', maxCount: 1}]), async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const user = jwt.decode(token, config.secret).username;
        if (!jwt.verify(token, config.secret)) return res.status(401).send('Invalid token');
        const { title, spotifyLink, timestamp } = req.body;
        const image = req.files.image[0];
        if (!title || !spotifyLink || !timestamp || !image) {
            return res.status(400).send('Missing required fields');
        }

        if (!/https:\/\/open.spotify.com\/track\/([a-zA-Z0-9]+)(\?si=[a-zA-Z0-9]+)?/g.test(spotifyLink)) {
            return res.status(400).send('Invalid Spotify link');
        }

        const totalSeconds = timestamp.split(':').reduce((acc, time) => 60 * acc + +time, 0);
        const newPost = new Post({ title, spotifyLink, timestamp: totalSeconds , username: user, image });

        await newPost.save();
        res.status(201).send();
    } catch (error) {
        console.error(error);
        return res.status(401).send(error.message);
    }
});

app.post('/post/:id/like', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const post = await Post.findOne({ id: req.params.id });
        const user = await User.findOne({ username: post.username });
        if (!post) return res.status(404).send('Post not found');
        if (!jwt.verify(token, config.secret)) return res.status(401).send('Invalid token');
        if (req.body.like) {
            if (user && jwt.decode(token, config.secret).username !== user.username) user.notifications.push({ notificationType: 'like', notificationCauser: jwt.decode(token, config.secret).username, link: `/post/${post.id}` });
            post.likes++;
            post.likedBy.push(jwt.decode(token, config.secret).username);
        } else {
            post.likes--;
            post.likedBy = post.likedBy.filter((user) => user !== jwt.decode(token, config.secret).username);
        }
        await post.save();
        await user.save();
        res.status(200).json({ likes: post.likes });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

app.post('/post/:id/comment', async (req, res) => {
    try {
        if (!jwt.verify(req.headers.authorization.split(' ')[1], config.secret)) return res.status(401).send('Invalid token');
        if (!req.body || !req.body.text.trim()) return res.status(400).send('Comment text is required');
        const post = await Post.findOne({ id: req.params.id });
        const user = await User.findOne({ username: post.username });
        if (!post) return res.status(404).send('Post not found');
        if (user && jwt.decode(req.headers.authorization.split(' ')[1], config.secret).username !== user.username) {
            user.notifications.push({ notificationType: 'comment', notificationCauser: jwt.decode(req.headers.authorization.split(' ')[1], config.secret).username, link: `/post/${post.id}` });
            await user.save();
        }
        post.comments.push({ username: jwt.decode(req.headers.authorization.split(' ')[1], config.secret).username, text: req.body.text, date: new Date() });
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

app.post('/profile/:username/follow', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const user = await User.findOne({ username: req.params.username });
        const follower = await User.findOne({ username: jwt.decode(token, config.secret).username });
        if (!user) return res.status(404).send('User not found');
        if (!jwt.verify(token, config.secret)) return res.status(401).send('Invalid token');
        if (!user.followers.includes(jwt.decode(token, config.secret).username)) {
            user.notifications.push({ notificationType: 'follow', notificationCauser: jwt.decode(token, config.secret).username });
            user.followers.push(jwt.decode(token, config.secret).username);
            follower.following.push(req.params.username);
        } else {
            user.followers = user.followers.filter((follower) => follower !== jwt.decode(token, config.secret).username);
            follower.following = follower.following.filter((followed) => followed !== req.params.username);
        }
        await user.save();
        await follower.save();
        res.status(200).json({ followers: user.followers });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

app.put('/profile', upload.fields([{name: 'bio', maxCount: 1}, {name: 'spotifyLink', maxCount: 1}]), async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!jwt.verify(token, config.secret)) return res.status(401).send('Invalid token');
        const user = jwt.decode(token, config.secret).username;
        const { bio, spotifyLink } = req.body;

        if (!/https:\/\/open.spotify.com\/track\/([a-zA-Z0-9]+)(\?si=[a-zA-Z0-9]+)?/g.test(spotifyLink)) {
            return res.status(400).send('Invalid Spotify link');
        }

        const updatedUser = await User.findOneAndUpdate({ username: user }, { bio, favoriteSong: spotifyLink });
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        return res.status(401).send(error.message);
    }
});

app.delete('/notifications', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!jwt.verify(token, config.secret)) return res.status(401).send('Invalid token');
        const user = await User.findOne({ username: jwt.decode(token, config.secret).username });
        user.notifications = [];
        await user.save();
        res.status(200).send();
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

app.listen(80, () => {
    console.log('Server started');
});