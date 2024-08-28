const express = require('express');
const config = require('./config.json');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect(config.mongooseConnection + 'Synesthesic', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const newUser = new User({ username, password });

    await newUser.save((err) => {
        if (err) {
            return res.status(500).send(err);
        } else {
            return res.status(200).send('User registered');
        }
    });
});

app.listen(80, () => {
    console.log('Server started');
});