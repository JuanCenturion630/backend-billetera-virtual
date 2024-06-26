const PrestamoService = require('../services/prestamosService');
const prestamoServicio = new PrestamoService();

class PrestamosController {
  /**
   * 
   * @param {*} req : usuario (email/alias/Cvu), monto, cuotas.
   * @param {*} res : JSON con el objeto "prestamo".
   */
  async crearPrestamo(req, res) {
    try {
      const { usuario, monto, cuotas } = req.body;
      const prestamo = await prestamoServicio.crearPrestamo(usuario, monto, cuotas);
      res.status(201).json({
        descripcion: "Préstamo exitoso.",
        prestamo: prestamo
      });
    } catch (error) {
      res.status(401).json({ 
        descripcion: "Error al crear el préstamo.",
        detalles: error.message
      });
    }
  }

  /**
   * 
   * @param {*} req : id del usuario.
   * @param {*} res : JSON con el objeto "prestamo".
   */
  async pagarCuota(req, res) {
    try {
      const usuario_id = req.params.idUsuario;
      const prestamo = await prestamoServicio.pagarCuota(usuario_id);
      res.status(201).json({
        descripcion: "Pagaste la cuota con éxito.",
        cuotas: prestamo.cuota_actual + '/' + prestamo.cant_cuotas,
        proximaCuota: prestamo.vencimiento_cuota,
        prestamo: prestamo
      });
    } catch (error) {
      res.status(401).json({ 
        descripcion: "Error al pagar la cuota.",
        detalles: error.message
      });
    }
  }

  /**
   * 
   * @param {*} req : id del usuario.
   * @param {*} res : JSON con el objeto "prestamo".
   */
  async verPrestamo(req, res) {
    try {
      const usuario_id = req.params.idUsuario;
      const prestamos = await prestamoServicio.verPrestamo(usuario_id);
      res.status(201).json({
        descripcion: "Tus préstamos anteriores.",
        listado: prestamos
      });
    } catch (error) {
      res.status(401).json({ 
        descripcion: "Error al buscar tus préstamos antiguos.",
        detalles: error.message
      });
    }
  }
}

module.exports = PrestamosController;
