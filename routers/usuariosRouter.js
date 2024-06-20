const express = require('express');
const usuariosRouter = express.Router();
const UsuariosController = require('../controllers/usuariosController'); //Importar la clase "usuariosService".
const usuarioControlador = new UsuariosController(); //Instanciar la clase "usuariosService".
const verifyToken = require("../middleware/verifyToken");

usuariosRouter.post('/crear-usuario', usuarioControlador.crearUsuario);
usuariosRouter.post('/login', usuarioControlador.login);
usuariosRouter.get('/buscar-usuario/:busqueda', usuarioControlador.buscarUsuario); //"busqueda": email, alias o CVU.
usuariosRouter.get('/listar-usuarios/:idExcluido', usuarioControlador.listarUsuariosExcluyendoLogeado);

usuariosRouter.put('/sumar-saldo', usuarioControlador.sumarSaldo);
usuariosRouter.put('/restar-saldo', usuarioControlador.restarSaldo);
usuariosRouter.put('/transferir-saldo', usuarioControlador.transferirSaldo);

module.exports = usuariosRouter;