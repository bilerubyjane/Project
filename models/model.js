const dbConn = require('../db');

var Stuff = function(item){
    this.nama = item.nama;
    this.jumlah = item.jumlah;
    this.keterangan = item.keterangan;
};

Stuff.create = function(newStuff, result) {
    dbConn.query(
        'INSERT INTO stuff (nama, jumlah, keterangan) VALUES (?,?,?)',
        [newStuff.nama, newStuff.jumlah, newStuff.keterangan],
        function(err, res) {
            if (err) {
                console.log('error: ', err);
                result(err, null);
            } else {
                console.log(res.insertedId);
                result(null, res.insertedId);
            }
        }
    );
};

Stuff.findAll = function (result) {
    dbConn.query('SELECT * FROM stuff', function (err, res) {
        if (err) {
            console.log('error: ', err);
            result(null, err);
        } else {
            console.log('stuff: ', res);
            result(null, res);
        }
    });
};

Stuff.findById = function (id, result) {
    dbConn.query('SELECT * FROM stuff WHERE id = ?', id, function (err, res) {
        if (err) {
            console.log('error: ', err);
            result(err, null);
        } else {
            result(null, res[0]);
        }
    });
};

Stuff.update = function (id, stuff, result) {
    dbConn.query(
        'UPDATE stuff SET nama = ?, jumlah = ?, keterangan = ? WHERE id = ?',
        [stuff.nama, stuff.jumlah, stuff.keterangan, id],
        function (err, res) {
            if (err) {
                console.log('error: ', err);
                result(err, null);
            } else {
                result(null, res);
            }
        }
    );
};

Stuff.delete = function (id, result) {
    dbConn.query('DELETE FROM stuff WHERE id = ?', id, function (err, res) {
        if (err) {
            console.log('error: ', err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

module.exports = Stuff;
