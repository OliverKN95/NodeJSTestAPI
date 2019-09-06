const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

//Traer todos los usuarios
router.get('/', (req, res) => {  
    mysqlConnection.query('SELECT * FROM users', (err, rows, fields) => {
        if (!err) {
            res.json (rows);
        } else {
            console.log('Error al ejecutar la consulta.', err);
        }
    });
});

//Traer solo un usuario por ID
router.get('/:id', (req, res) => {  
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM users WHERE id = ?', [id], (err, rows, fields) => {
        if (!err) {
            res.json (rows[0]);
        } else {
            console.log('Error al ejecutar la consulta.', err);
        }
    });
});

//Insertar nuevo usuario
router.post('/NewUser',(req, res)=>{
    const { id, nombre, apePat, apeMat, edad, rol, usuario, pass} = req.body;
    const query = `CALL userAddOrEdit(?, ?, ?, ?, ?, ?, ?, ?);`;
    mysqlConnection.query(query, [id, nombre, apePat, apeMat, edad, rol, usuario, pass], (err, rows, fields) =>{
        if(!err){
            console.log(query.toString());
            console.log(id, nombre, apePat, apeMat, edad, rol, usuario, pass);
            res.json({Status: 'Usuario guardado correctamente.'});
        }else{
            console.log(err);
        }
    });
});

module.exports = router;