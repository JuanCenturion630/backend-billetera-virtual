const express = require('express');
const prestamosRouter = express.Router();
const PrestamosController = require('../controllers/prestamosController');
const prestamosControlador = new PrestamosController();

prestamosRouter.post('/crear-prestamo', prestamosControlador.crearPrestamo);
prestamosRouter.put('/pagar-cuota/:idUsuario', prestamosControlador.pagarCuota);
prestamosRouter.get('/ver-prestamos/:idUsuario', prestamosControlador.verPrestamo);

module.exports = prestamosRouter;
