//Rutas para el manejo de solicitudes HTTP:

const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

router.post('/', usuariosController.crearUsuario); //Ruta para crear un nuevo usuario.

module.exports = router;
