const Mysql = require('mysql');

const connection = Mysql.createConnection({
    host    : 'localhost',
    user    : 'root',
    password: '',
    database: 'tanamin'
});

module.exports = {connection};