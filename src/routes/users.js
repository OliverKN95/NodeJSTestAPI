const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const md5 = require('md5');

const mysqlConnection = require('../database');

//Login
router.post('/api/login', (req, res) => {  
    const { usuario, pass} = req.body;
    var passEnc = md5(pass);
    mysqlConnection.query('SELECT * FROM users WHERE usuario = ? AND pass = ?', [usuario, passEnc] , (err, rows, fields) => {
        if (!err) {
            if(!rows[0]){
                res.json ({Resp: "El usuario no existe"});
            }else{
                const user = rows[0];
                const token = jwt.sign({user}, 'llaveToken');
                res.json ({token});
            }
            
        } else {
            console.log('Error al ejecutar la consulta.', err);
        }
    });
});

//Verificar token
function ensureToken(req, res, next){
    const bearerHeader = req.headers['authorization'];
    console.log(bearerHeader);
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }else{
        res.sendStatus(403);
    }
}

//Traer todos los usuarios
router.get('/api/Users', ensureToken, (req, res) => {  
    jwt.verify(req.token, 'llaveToken', (err)=>{
        if(err){
            console.log(req.token);
            res.json(403, err);
        }else{
            mysqlConnection.query('SELECT * FROM users', (err, rows, fields) => {
                if (!err) {
                    res.json (rows);
                } else {
                    console.log('Error al ejecutar la consulta.', err);
                }
            });
        }
    });
});

//Traer solo un usuario por ID
router.get('/api/User/:id', ensureToken, (req, res) => {  
    jwt.verify(req.token, 'llaveToken', (err)=>{
        if(err){
            console.log(req.token);
            res.json(403, err);
        }else{
            const { id } = req.params;
            mysqlConnection.query('SELECT * FROM users WHERE id = ?', [id], (err, rows, fields) => {
                if (!err) {
                    res.json (rows[0]);
                } else {
                    console.log('Error al ejecutar la consulta.', err);
                }
            });
        }
    });
});

//Insertar nuevo usuario
router.post('/api/NewUser', ensureToken, (req, res)=>{
    jwt.verify(req.token, 'llaveToken', (err)=>{
        if(err){
            console.log(req.token);
            res.json(403, err);
        }else{
            var decoded = jwt.decode(req.token, 'llaveToken');
            if(decoded.user.rol == 1){
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
            }else{
                res.json({Mensaje: 'No cuentas con el rol adecuado para realizar la operación solicitada.'});
            }
        }
    });      
});

//Actualizar usuario
router.put('/api/EditUser/:id', ensureToken, (req, res)=>{
    jwt.verify(req.token, 'llaveToken', (err)=>{
        if(err){
            console.log(req.token);
            res.json(403, err);
        }else{
            var decoded = jwt.decode(req.token, 'llaveToken');
            if(decoded.user.rol == 1){
                const { nombre, apePat, apeMat, edad, rol, usuario, pass} = req.body;
                const { id } = req.params;
                const query = `CALL userAddOrEdit(?, ?, ?, ?, ?, ?, ?, ?);`;
                mysqlConnection.query(query, [id, nombre, apePat, apeMat, edad, rol, usuario, pass], (err, rows, fields) =>{
                    if(!err){
                        console.log(query.toString());
                        console.log(id, nombre, apePat, apeMat, edad, rol, usuario, pass);
                        res.json({Status: 'Usuario actualizado correctamente.'});
                    }else{
                        console.log(err);
                    }
                });
            }else{
                res.json({Mensaje: 'No cuentas con el rol adecuado para realizar la operación solicitada.'});
            }
        }
    });
});

//Eliminar usuario
router.delete('/api/DeleteUser/:id', ensureToken, (req, res)=>{
    jwt.verify(req.token, 'llaveToken', (err)=>{
        if(err){
            console.log(req.token);
            res.json(403, err);
        }else{
            var decoded = jwt.decode(req.token, 'llaveToken');
            if(decoded.user.rol == 1){
                const { id } = req.params;
                mysqlConnection.query('DELETE FROM users WHERE id = ?', [id], (err, rows, fields) =>{
                    if(!err){
                        res.json({Status: 'Usuario eliminado correctamente.'});
                    }else{
                        console.log(err);
                    }
                });
            }else{
                res.json({Mensaje: 'No cuentas con el rol adecuado para realizar la operación solicitada.'});
            }
        }
    });    
});

module.exports = router;