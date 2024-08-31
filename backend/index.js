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
        const posts = await Post.find();
        res.status(200).json(posts);
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
        if (!post) return res.status(404).send('Post not found');
        if (!jwt.verify(token, config.secret)) return res.status(401).send('Invalid token');
        if (req.body.like) {
            post.likes++;
            post.likedBy.push(jwt.decode(token, config.secret).username);
        } else {
            post.likes--;
            post.likedBy = post.likedBy.filter((user) => user !== jwt.decode(token, config.secret).username);
        }
        await post.save();
        res.status(200).json({ likes: post.likes });
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

app.listen(80, () => {
    console.log('Server started');
});