const express = require('express');
const usuariosRouter = express.Router();
const UsuariosController = require('../controllers/usuariosController'); //Importar la clase "usuariosService".
const usuarioControlador = new UsuariosController(); //Instanciar la clase "usuariosService".
const verifyToken = require("../middleware/verifyToken");

usuariosRouter.post('/crear-usuario', usuarioControlador.crearUsuario);
usuariosRouter.post('/login', verifyToken, usuarioControlador.login);
usuariosRouter.post('/buscar-usuario', usuarioControlador.buscarUsuario);
usuariosRouter.post('/listar-usuarios', usuarioControlador.listarUsuariosExcluyendoLogeado);
usuariosRouter.post('/transferir-saldo', usuarioControlador.transferirSaldo);
usuariosRouter.post('/sumar-saldo', usuarioControlador.sumarSaldo);

module.exports = usuariosRouter;

/* app.post('/crear-usuario', (req, res) => usuarioControlador.crearUsuario(req, res)); //Endpoint de crear usuario.
app.post('/login', (req, res) => usuarioControlador.login(req, res)); //Endpoint de login.
app.post('/buscar-usuario', (req, res) => usuarioControlador.buscarUsuario(req, res)); //Endpoint de buscar usuario.
app.post('/listar-usuarios', (req, res) => usuarioControlador.listarUsuariosExcluyendoLogeado(req, res)); //Endpoint de listar usuarios.
app.post('/transferir-saldo', (req, res) => usuarioControlador.transferirSaldo(req, res)); //Endspoint de transferir.
app.post('/sumar-saldo', (req, res) => usuarioControlador.sumarSaldo(req, res)); //Endspoint de sumar saldo. */