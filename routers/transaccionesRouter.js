const express = require('express');
const transaccionesRouter = express.Router();
const TransaccionesController = require('../controllers/transaccionesController') //Importar la clase "TransaccionesController".
const transaccionControlador = new TransaccionesController(); //Instanciar la clase "TransaccionesController".
const verifyToken = require("../middleware/verifyToken");

transaccionesRouter.post('/crear-transaccion', verifyToken, transaccionControlador.crearTransaccion);
transaccionesRouter.get('/listar-transacciones/:id', verifyToken, transaccionControlador.listarTransacciones);

module.exports = transaccionesRouter;
