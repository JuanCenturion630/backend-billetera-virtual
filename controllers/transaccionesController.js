//Controller es la API que conecta el frontend con el back (capa services/repository/models).
//Debe ser limitada a solo recibir o emitir archivos JSON o XML. Si hace más cosas, viola la arquitectura.

const TransaccionesService = require('../services/transaccionesService'); //Importar la clase "usuariosService".
const transaccionService = new TransaccionesService(); //Instanciar la clase "usuariosService".

class TransaccionesController {
    /**
     * Controla la conexión del front con crear transacciones.
     * @param {*} req : JSON que recibe del frontend (monto, descripcion, categoria, emisor_id, receptor_id)
     * @param {*} res : JSON que se envía al frontend.
     */
    async crearTransaccion(req, res) {
        try {
            const { monto, descripcion, categoria, emisor_id, receptor_id } = req.body;
            const nuevaTransaccion = await transaccionService.crearTransaccion(monto,descripcion,categoria,emisor_id,receptor_id);
            res.status(201).json({ //Enviar respuesta al cliente. 
                descripcion: "Transacción creada con éxito.", 
                transaccion: nuevaTransaccion 
            });
        } catch(error) {
            //console.error('Error en transaccionesController.js (crearTransaccion):'.bgRed, error);
            res.status(501).json({ 
                descripcion: "Error al crear la transacción.",
                transaccion: error.message
            }); //El controlador por fallo propio, o fallo de su servicio o repositorio, envia un JSON al cliente.
        }
    }

    /**
     * Controla la conexión del front con listar transacciones.
     * @param {*} req : JSON que recibe del frontend.
     * @param {*} res : JSON que se envía al frontend.
     */
    async listarTransacciones(req, res) {
        try {
            const idUsuarioLogeado = req.params.id;
            const listadoTransacciones = await transaccionService.listarTransacciones(idUsuarioLogeado);
            res.status(201).json({ //Enviar respuesta al cliente. 
                descripcion: "Listado de tus transacciones.", 
                transacciones: listadoTransacciones 
            });
        } catch(error) {
            //console.error('Error en transaccionesController.js (listarTransacciones):'.bgRed, error);
            res.status(501).json({ 
                descripcion: "Error al listar las transacciones.",
                transacciones: error.message
            }); //El controlador por fallo propio, o fallo de su servicio o repositorio, envia un JSON al cliente.
        }
    }
}

module.exports = TransaccionesController;