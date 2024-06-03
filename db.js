const mysql = require('mysql');

const dbConn = mysql.createConnection({
    host : '34.101.117.66',
    user : 'root',
    password : '',
    database : 'stuff',
})

dbConn.connect(function(err) {
    if (err) throw err;
    console.log('Database Connected');
  });

module.exports = dbConn;
