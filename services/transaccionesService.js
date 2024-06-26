/* Se encarga de la lógica de negocios, como fabricar sus propios datos o validar los datos recibidos del frontend. 
  Por ejemplo: si el usuario y contraseña del frontend coinciden con algun usuario y contraseña de la base de datos.
  Debe ser limitada a solo a ello. Si hace más cosas, viola la arquitectura. */

const color = require('colors');
const TransaccionesRepository = require('../repositories/transaccionesRepository'); //Referencio a la clase "transaccionesRepository".
const transaccionesRepositorio = new TransaccionesRepository(); //Instacio a la clase "transaccionesRepository".

class TransaccionesService {
    /**
     * Crea registro de transacciones en la base de datos.
     * @param {*} monto 
     * @param {*} descripcion 
     * @param {*} categoria 
     * @param {*} emisor_id 
     * @param {*} receptor_id 
     * @returns 
     */
    async crearTransaccion(monto, descripcion, categoria, emisor_id, receptor_id) {
        try {
            let fecha = new Date();
            const nuevaTransaccion = await transaccionesRepositorio.crearTransaccion(fecha,monto,descripcion,categoria,emisor_id,receptor_id);
            return nuevaTransaccion.dataValues;
        } catch(error) {
            //console.error('Error en usuariosService.js (crearUsuario):'.bgRed, error);
            /* El throw realiza una llamada ascendente para la resolución del error, es decir, la resolución del error 
            se terceriza a la función que llamó a esta. Esta es "crearTransaccion" del servicio, que es llamada por 
            "crearTransaccion" del controlador, por lo que el error se resolverá allí. */
            throw new Error(error);
        }
    }

    /**
     * Lista las transacciones en función del ID del usuario logeado.
     * @param {*} idUsuarioLogeado
     */
    async listarTransacciones(idUsuarioLogeado) {
        try {
            const listaTransacciones = await transaccionesRepositorio.listarTransacciones(idUsuarioLogeado);
            return listaTransacciones;
        } catch(error) {
            //console.error('Error en transaccionesRepository.js (listarTransacciones):', error);
            /* El throw realiza una llamada ascendente para la resolución del error, es decir, la resolución 
            del error se terceriza a la función que llamó a esta. Esta es "listarTransacciones" del servicio, 
            que es llamada por "listarTransacciones" del controlador, por lo que el error se resolverá allí. */
            throw new Error(error);
        }
    }
}

module.exports = TransaccionesService;