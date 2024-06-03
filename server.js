const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const PORT = 8080;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const router = require('./routes/router');
const userRouter = require('./routes/userRouter');

app.use(express.static('public'));

app.use('/api', authenticateToken, router);
app.use('/auth', userRouter);

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, 'secretkey', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
