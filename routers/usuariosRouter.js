const express = require('express');
const usuariosRouter = express.Router();
const UsuariosController = require('../controllers/usuariosController'); //Importar la clase "usuariosService".
const usuarioControlador = new UsuariosController(); //Instanciar la clase "usuariosService".
const verifyToken = require("../middleware/verifyToken");

usuariosRouter.post('/crear-usuario', usuarioControlador.crearUsuario);
usuariosRouter.post('/login', verifyToken, usuarioControlador.login);
usuariosRouter.get('/buscar-usuario/:busqueda', verifyToken, usuarioControlador.buscarUsuario); //"busqueda": email, alias o CVU.
usuariosRouter.get('/listar-usuarios/:idExcluido', verifyToken, usuarioControlador.listarUsuariosExcluyendoLogeado);
usuariosRouter.put('/sumar-saldo', verifyToken, usuarioControlador.sumarSaldo);
usuariosRouter.put('/restar-saldo', verifyToken, usuarioControlador.restarSaldo);
usuariosRouter.put('/transferir-saldo', verifyToken, usuarioControlador.transferirSaldo);

module.exports = usuariosRouter;