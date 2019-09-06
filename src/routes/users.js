const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/', function(req, res) {    
    getUsersQuery(function(err, result) {
        if (err) {
            console.log(err);
        }        
        res.json(result);
    });
});

function getUsersQuery(callback) {
    var usersDataQuery = mysqlConnection.query('SELECT * from users', function(err, rows, fields) {
        if (!err) {
            if (rows) {
                callback(null, rows);
            }
        } else {
            callback(err, null);
            console.log('Error al ejecutar la consulta.');
        }
    });
}

module.exports = router;