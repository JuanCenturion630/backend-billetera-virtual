//Se encarga de interactuar con el modelo "transacciones" (abstracción de tabla "transacciones" en base de datos).
//Debe solo invocar métodos ORM que emulen sentencias SQL y hacer returns. Si hace más cosas, viola la arquitectura.

const color = require('colors');
const transaccionesORM = require('../models/transacciones');

class TransaccionesRepository {
    /**
     * @function crearTransaccion : Ejecuta un ORM para insertar registro en base de datos.
     * @param {*} fecha : fecha de realización de la transacción.
     * @param {*} monto : monto de la transacción.
     * @param {*} descripcion : comentario que describa la transacción.
     * @param {*} categoria : categoría de la transacción.
     * @param {*} emisor_id : emisor de la transacción.
     * @param {*} receptor_id : receptor de la transacción.
     * @returns : devuelve un registro de transacción.
     */
    async crearTransaccion(fecha, monto, descripcion, categoria, emisor_id, receptor_id) {
        try {
            /* Realiza un "INSERT INTO usuarios VALUES(emisor,receptor...)" pero con ORM, con "await" esperando 
            la respuesta y se retorna. */
            return await transaccionesORM.create({ 
                fecha: fecha,
                monto: monto,
                descripcion: descripcion,
                categoria: categoria,
                emisor_id: emisor_id,
                receptor_id: receptor_id
            });
        }
        catch (error) {
            //console.error('Error en transaccionesRepository.js (crearTransaccion):'.bgRed, error);
            /* El throw realiza una llamada ascendente para la resolución del error, es decir, la resolución 
            del error se terceriza a la función que llamó a esta. Esta es "crearTransaccion" del repositorio, 
            que es llamada por "crearTransaccion" del servicio, por lo que el error se resolverá allí. */
            throw new Error(error);
        }
    } //FUNCIONA.

    /**
     * @function listadoTransacciones : lista las transacciones del usuario logeado.
     * @param {*} idUsuarioLogeado 
     */
    async listarTransacciones(idUsuarioLogeado) {
        try {
            /* Realiza un "SELECT * FROM usuarios WHERE emisor_id=idUsuarioLogeado" pero con ORM, 
            con "await" esperando la respuesta y se retorna. */
            return await transaccionesORM.findAll(
                { 
                    where: { 
                        emisor_id: idUsuarioLogeado
                    }
                }
            );
        } catch (error) {
            //console.error('Error en transaccionesRepository.js (buscarUsuario):', error);
            /* El throw realiza una llamada ascendente para la resolución del error, es decir, la resolución 
            del error se terceriza a la función que llamó a esta. Esta es "listarTransacciones" del repositorio, 
            que es llamada por "listarTransacciones" del servicio, por lo que el error se resolverá allí. */
            throw new Error(error);
        }
    } //FUNCIONA.
}

module.exports = TransaccionesRepository;