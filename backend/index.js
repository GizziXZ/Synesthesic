const express = require('express');
const config = require('./config.json');
const mongoose = require('mongoose');
const User = require('./models/users');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');

mongoose.connect(config.mongooseConnection + 'Synesthesic', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

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

app.listen(80, () => {
    console.log('Server started');
});