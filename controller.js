const Stuff = require("./models/model");
const User = require("./models/userModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.findAll = function (req, res) {
    Stuff.findAll(function (err, stuff) {
        if (err) res.send(err);
        res.send(stuff);
    });
};

exports.create = function (req, res) {
    const new_stuff = new Stuff(req.body);
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send({error: true, message: 'Please provide all required field'});
    } else {
        Stuff.create(new_stuff, function (err, stuff) {
            if (err) res.send(err);
            else res.json({error: false, message: 'Stuff added successfully', data: stuff});
        });
    }
};

exports.findById = function (req, res) {
    Stuff.findById(req.params.id, function (err, stuff) {
        if (err) res.send(err);
        res.json(stuff);
    });
};

exports.update = function (req, res) {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send({error: true, message: 'Please provide all required field'});
    } else {
        Stuff.update(req.params.id, new Stuff(req.body), function (err) {
            if (err) res.send(err);
            res.json({error: false, message: 'Stuff updated successfully'});
        });
    }
};

exports.delete = function (req, res) {
    Stuff.delete(req.params.id, function (err) {
        if (err) res.send(err);
        res.json({error: false, message: 'Stuff deleted successfully'});
    });
};

exports.register = async function (req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({error: true, message: 'Please provide email and password'});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    User.create(newUser, function (err, user) {
        if (err) res.send(err);
        res.json({error: false, message: 'User registered successfully', data: user});
    });
};

exports.login = function (req, res) {
    const { email, password } = req.body;
    User.findByEmail(email, async function (err, user) {
        if (err) res.send(err);
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).send({error: true, message: 'Invalid email or password'});
        }
        const token = jwt.sign({ id: user.id }, 'secretkey', { expiresIn: '1h' });
        res.json({error: false, message: 'Login successful', token: token});
    });
};

