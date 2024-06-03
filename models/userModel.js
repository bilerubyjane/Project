const dbConn = require('../db');

var User = function(user) {
    this.email = user.email;
    this.password = user.password;
};

User.create = function(newUser, result) {
    dbConn.query('INSERT INTO user (email, password) VALUES (?, ?)', [newUser.email, newUser.password], function(err, res) {
        if (err) {
            console.log('error: ', err);
            result(err, null);
        } else {
            result(null, res.insertId);
        }
    });
};

User.findByEmail = function (email, result) {
    dbConn.query('SELECT * FROM user WHERE email = ?', email, function (err, res) {
        if (err) {
            console.log('error: ', err);
            result(err, null);
        } else {
            result(null, res[0]);
        }
    });
};

module.exports = User;
