const express = require('express');
const prestamosRouter = express.Router();
const PrestamosController = require('../controllers/prestamosController');
const prestamosControlador = new PrestamosController();
const verifyToken = require("../middleware/verifyToken");

prestamosRouter.post('/crear-prestamo', verifyToken, prestamosControlador.crearPrestamo);
prestamosRouter.put('/pagar-cuota/:idUsuario', verifyToken, prestamosControlador.pagarCuota);
prestamosRouter.get('/ver-prestamos/:idUsuario', verifyToken, prestamosControlador.verPrestamo);

module.exports = prestamosRouter;
