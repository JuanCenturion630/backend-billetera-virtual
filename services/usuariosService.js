/* Se encarga de la lógica de negocios, como fabricar sus propios datos o validar los datos recibidos del frontend. 
  Por ejemplo: si el usuario y contraseña del frontend coinciden con algun usuario y contraseña de la base de datos.
  Debe ser limitada a solo a ello. Si hace más cosas, viola la arquitectura. */

const color = require('colors');
const UsuariosRepository = require('../repositories/usuariosRepository'); //Referencio a la clase "usuariosRepository".
const usuarioRepositorio = new UsuariosRepository(); //Instacio a la clase "usuarioRepository".
const TransaccionesService = require('../services/transaccionesService'); //Referencio a la clase "transaccionesService".
const transaccionesServicio = new TransaccionesService(); //Instacio a la clase "transaccionesService".
const prestamosService = require('../services/prestamosService');
const prestamosServicio = new prestamosService();

class UsuariosService {
  /**
   * Realiza reglas de negocios (crear cvu y alias) antes de escribir en la base de datos.
   * @param {*} nombre 
   * @param {*} apellido 
   * @param {*} email 
   * @param {*} dni 
   * @param {*} cuil 
   * @param {*} contrasenia 
   * @returns: devuelve los resultados de las consultas ORM.
   */
  async crearUsuario(nombre, apellido, email, dni, cuil, contrasenia) {
    try {
      let nombreEnMinuscula = String(nombre).toLowerCase();
      let apellidoEnMinuscula = String(apellido).toLowerCase();
      let cvu = parseInt(dni) + parseInt(cuil);
      let alias = `${nombreEnMinuscula}.${apellidoEnMinuscula}.bz`;
      let saldo = "0";
      const nuevoUsuario = await usuarioRepositorio.crearUsuario(nombre, apellido, email, dni, cuil, contrasenia, cvu, alias, saldo);
      return nuevoUsuario;
    } catch (error) {
      //console.error('Error en usuariosService.js (crearUsuario):', error);
      /* El throw realiza una llamada ascendente para la resolución del error, es decir, la resolución del error 
      se terceriza a la función que llamó a esta. Esta es "crearUsuarios" del servicio, que es llamada por 
      "crearUsuario" del controlador, por lo que el error se resolverá allí. */
      throw new Error(error);
    }
  }

  /**
   * Busca usuarios registrados en la base de datos.
   * @param {*} email 
   * @param {*} contrasenia 
   * @returns: devuelve los resultados de las consultas ORM.
   */
  async login(email, contrasenia) {
    try {
      const logearUsuario = await usuarioRepositorio.login(email, contrasenia);
      console.log("Id usuario en login del servicio usuario: ".yellow, logearUsuario.dataValues.id);
      
      if (logearUsuario) { //Si el usuario existe...
        const fechaRetraso = await prestamosServicio.verPrestamoRetrasado(logearUsuario.dataValues.id);
        if(fechaRetraso) { //Si hay un retraso de pago...
          const retraso = await prestamosServicio.manejarRetrasoPago(logearUsuario.dataValues.id);
          return { logearUsuario, retraso };
        }
        else {
          return { logearUsuario, retraso: 'No tiene préstamos adeudados.' };
        } 
      }
      else {
        throw new Error('No existe el usuario.'); //El throw hará una resolución ascendente.
      }
    } catch (error) {
      //console.error('Error en usuariosService.js (login):', error);
      /* El throw realiza una resolución ascendente del error, es decir, la resolución del error se terceriza a
      la función que llamó a esta. Esta es "login" del servicio, que es llamada por "login" del controlador, 
      por lo que el error se resolverá allí. */
      throw new Error(error);
    }
  }

  /**
   * Busca usuarios en función de su id, email, CVU o alias.
   * @param {*} busqueda: representa al id, email, CVU o alias.
   * @returns: devuelve los resultados de las consultas en ORM.
   */
  async buscarUsuario(busqueda) {
    try {
      const buscarUsuario = await usuarioRepositorio.buscarUsuario(busqueda);
      if (!buscarUsuario) {
        throw new Error('No se encontraron coincidencias.'); //El throw hará una resolución ascendente.
      }
      else {
        return buscarUsuario.dataValues; //Se devuelve un objeto con varios subobjetos. Solo te interesa "dataValues".
      }
    } catch(error) {
      //console.error('Error en usuariosService.js (buscarUsuario):'.bgRed, error);
      /* El throw realiza una resolución ascendente del error, es decir, la resolución del error se terceriza 
      a la función que llamó a esta. Esta es "buscarUsuario" del servicio, que es llamada por "buscarUsuario" 
      del controlador, por lo que el error se resolverá allí. */
      throw new Error(error);
    }
  }

  /**
   * Busca el ID del usuario en función de su email, su CVU o su alias.
   * @param {*} busqueda: representa al email, CVU o alias.
   * @returns: devuelve los resultados de las consultas ORM.
   */
  async buscarID(busqueda) {
    try {
      const buscarID = await usuarioRepositorio.buscarID(busqueda);
      if (!buscarID) { return null; }
      else { return buscarID.dataValues.id; }
    } catch(error) {
      //console.error('Error en usuariosService.js (buscarUsuario):'.bgRed, error);
      /* El throw realiza una resolución ascendente del error, es decir, la resolución del error se terceriza 
      a la función que llamó a esta. Esta es "buscarUsuario" del servicio, que es llamada por "buscarUsuario" 
      del controlador, por lo que el error se resolverá allí. */
      throw new Error(error);
    }
  }

  /**
   * 
   * @param {*} idUsuarioLogeado 
   * @returns 
   */
  async listarUsuariosExcluyendoLogeado(idUsuarioLogeado) {
    try {
      const listadoUsuarios = await usuarioRepositorio.listarUsuariosExcluyendoLogeado(idUsuarioLogeado);
      return listadoUsuarios;
    } catch(error) {
      //console.error('Error en usuariosService.js (buscarUsuario):'.bgRed, error);
      /* El throw realiza una resolución ascendente del error, es decir, la resolución del error se terceriza 
      a la función que llamó a esta. Esta es "listarUsuariosExcluyendoLogeado" del servicio, que es llamada 
      por "listarUsuariosExcluyendoLogeado" del controlador, por lo que el error se resolverá allí. */
      throw new Error(error);
    }
  }

  /**
   * Transferir saldo de un usuario a otro a través de sus emails, sus alias o sus CVUs.
   * @param {*} emisor: email, alias o CVU del usuario emisor.
   * @param {*} receptor: email, alias o CVU del usuario receptor.
   * @param {*} monto 
   * @returns: devuelve los resultados de las consultas ORM.
   */
  async transferirSaldo(emisor,receptor,monto) {
    try {
      const transferir = await usuarioRepositorio.transferirSaldo(emisor,receptor,monto);
      const emisor_id = await this.buscarID(emisor);
      const receptor_id = await this.buscarID(receptor);
      const transaccion = await transaccionesServicio.crearTransaccion(monto,"Transferencia entre usuarios","Transferencia",emisor_id,receptor_id);
      return { transferir, transaccion};
    } catch(error) {
      //console.error('Error en usuariosService.js: (transferirSaldo)', error);
      /* El throw realiza una resolución ascendente del error, es decir, la resolución del error se terceriza 
      a la función que llamó a esta. Esta es "transferirSaldo" del servicio, que es llamada por "transferirSaldo"
      del controlador, por lo que el error se resolverá allí. */
      throw new Error(error);
    }
  }

  /**
   * Sumar saldo a un usuario a través de su email, su alias o CVU.
   * @param {*} usuario : email, alias o CVU.
   * @param {*} saldo : monto.
   * @returns: devuelve los resultados de las consultas ORM.
   */
  async sumarSaldo(usuario,monto) {
    try {
      const saldo = await usuarioRepositorio.sumarSaldo(usuario,monto);
      const emisor_id = await this.buscarID(usuario);
      const transaccion = await transaccionesServicio.crearTransaccion(monto,"Has agregado saldo","Sumarme saldo",emisor_id,emisor_id);
      return { saldo, transaccion };
    } catch(error) {
      //console.error('Error en usuariosService.js: (sumarSaldo)', error);
      /* El throw realiza una resolución ascendente del error, es decir, la resolución del error se terceriza a 
      la función que llamó a esta. Esta es "sumarSaldo" del servicio, que es llamada por "sumarSaldo" del 
      controlador, por lo que el error se resolverá allí. */
      throw new Error(error);
    }
  }

  /**
   * Resta saldo a un usuario a través de su email, su alias o CVU.
   * @param {*} usuario 
   * @param {*} monto 
   * @returns: devuelve los resultados de las consultas ORM.
   */
  async restarSaldo(usuario,monto) {
    try {
      const saldo = await usuarioRepositorio.restarSaldo(usuario,monto);
      const emisor_id = await this.buscarID(usuario);
      const transaccion = await transaccionesServicio.crearTransaccion(monto,"Has retirado saldo","Retirarme saldo",emisor_id,emisor_id);
      return { saldo, transaccion };
    } catch(error) {
      //console.error('Error en usuariosService.js: (restarSaldo)', error);
      /* El throw realiza una resolución ascendente del error, es decir, la resolución del error se terceriza a 
      la función que llamó a esta. Esta es "restarSaldo" del servicio, que es llamada por "restarSaldo" del 
      controlador, por lo que el error se resolverá allí. */
      throw new Error(error);
    }
  }
}

//Exportar la capa de servicio de usuarios.
module.exports = UsuariosService;
