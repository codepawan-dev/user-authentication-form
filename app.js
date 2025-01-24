const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/registration_form');

// express setup
const app = express();
const port = 3000;

// mongoose
const loginSchema = new mongoose.Schema({
    name: String,
    password: String
});

const Login = mongoose.model('Login', loginSchema);

// express specific
app.use('/static', express.static('static'))
app.use(express.urlencoded({ extended: true }));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')

app.get('/', (req, res) => {
    res.render('register', { title: "Registration", message: "Sign-up!", btnMsg: "Submit" })
})

app.get('/login', (req, res) => {
    res.render('login', { title: "Registration", message: "login", btnMsg: "Go" })
})

app.post('/submit', async (req, res) => {
    const { name, password } = req.body;
    try {
        const hashed_password = await bcrypt.hash(password, 10);
        const data = new Login({ name, password: hashed_password });
        await data.save();
        res.status(200).send('<h1>Registered succesfully </h1>');
    } catch (err) {
        res.status(200).send('<h1>Try again</h1>');
    }
})

app.post('/login', async (req, res) => {
    const { name, password } = req.body;
    try {
        const user = await Login.findOne({ name });
        if (user && await bcrypt.compare(password, user.password)) {
            res.status(200).send('<h1>Succces</h1>');
        } else {
            res.send('<h1>Invalid login info</h1>');
        }
    } catch (err) {
        res.send(`Error: ${err.message}`);
    }
});


app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})
