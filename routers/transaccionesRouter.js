const express = require('express');
const transaccionesRouter = express.Router();
const TransaccionesController = require('../controllers/transaccionesController'); //Importar la clase "TransaccionesController".
const transaccionControlador = new TransaccionesController(); //Instanciar la clase "TransaccionesController".

transaccionesRouter.post('/crear-transaccion', transaccionControlador.crearTransaccion);
transaccionesRouter.post('/listar-transacciones', transaccionControlador.listarTransacciones);

module.exports = transaccionesRouter;
