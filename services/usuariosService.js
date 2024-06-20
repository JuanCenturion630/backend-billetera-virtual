/* Se encarga de la lógica de negocios, como fabricar sus propios datos o validar los datos recibidos del frontend. 
  Por ejemplo: si el usuario y contraseña del frontend coinciden con algun usuario y contraseña de la base de datos.
  Debe ser limitada a solo a ello. Si hace más cosas, viola la arquitectura. */

const color = require('colors');
const UsuariosRepository = require('../repositories/usuariosRepository'); //Referencio a la clase "usuariosRepository".
const usuarioRepositorio = new UsuariosRepository(); //Instacio a la clase "usuarioRepository".
const TransaccionesService = require('../services/transaccionesService'); //Referencio a la clase "transaccionesService".
const transaccionesServicio = new TransaccionesService(); //Instacio a la clase "transaccionesService".

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
      if (!logearUsuario) {
        throw new Error('No existe el usuario.'); //Lógica de negocio. El throw hará una resolución ascendente.
      }
      else {
        return logearUsuario;
      }
    } catch (error) {
      throw new Error(error); /* El throw realiza una resolución ascendente del error, es decir, 
                            la resolución del error se terceriza a la función que llamó a esta. Esta es 
                            "login" del servicio, que es llamada por "login" del controlador, 
                            por lo que el error se resolverá allí. */
      //console.error('Error en usuariosService.js (login):', error); //Comunica por consola si el error ocurre aquí.
    }
  }

  /**
   * Busca usuarios en función de su email, su CVU o su alias.
   * @param {*} busqueda: representa al email, CVU o alias.
   * @returns: devuelve los resultados de las consultas ORM.
   */
  async buscarUsuario(busqueda) {
    try {
      const buscarUsuario = await usuarioRepositorio.buscarUsuario(busqueda);
      if (!buscarUsuario) {
        throw new Error('No se encontraron coincidencias.'); //El throw hará una resolución ascendente.
      }
      else {
        return buscarUsuario;
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
      else { return buscarID; }
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

      const emisorDatos = await usuarioRepositorio.buscarID(emisor);
      const emisor_id = emisorDatos.dataValues.id;

      const receptorDatos = await usuarioRepositorio.buscarID(receptor);
      const receptor_id = receptorDatos.dataValues.id;

      const transaccion = await transaccionesServicio.crearTransaccion(monto,"Transferencia entre usuarios","Transferencia",emisor_id,receptor_id);
      
      return { transferir, transaccion};
    } catch(error) {
      throw new Error(error); /* El throw realiza una resolución ascendente del error, es decir, 
                            la resolución del error se terceriza a la función que llamó a esta. Esta es 
                            "transferirSaldo" del servicio, que es llamada por "transferirSaldo" del controlador, 
                            por lo que el error se resolverá allí. */
      //console.error('Error en usuariosService.js: (transferirSaldo)', error); //Comunica por consola si el error ocurre aquí.
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
      const emisor = await usuarioRepositorio.buscarID(usuario);
      const emisor_id = emisor.dataValues.id;
      const transaccion = await transaccionesServicio.crearTransaccion(monto,"Has agregado saldo","Sumarme saldo",emisor_id,emisor_id);
      return { saldo, transaccion };
    } catch(error) {
      throw new Error(error); /* El throw realiza una resolución ascendente del error, es decir, 
                            la resolución del error se terceriza a la función que llamó a esta. Esta es 
                            "sumarSaldo" del servicio, que es llamada por "sumarSaldo" del controlador, 
                            por lo que el error se resolverá allí. */
      //console.error('Error en usuariosService.js: (sumarSaldo)', error); //Comunica por consola si el error ocurre aquí.
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
      const emisor = await usuarioRepositorio.buscarID(usuario);
      const emisor_id = emisor.dataValues.id;
      const transaccion = await transaccionesServicio.crearTransaccion(monto,"Has retirado saldo","Retirarme saldo",emisor_id,emisor_id);
      return { saldo, transaccion };
    } catch(error) {
      throw new Error(error); /* El throw realiza una resolución ascendente del error, es decir, 
                            la resolución del error se terceriza a la función que llamó a esta. Esta es 
                            "restarSaldo" del servicio, que es llamada por "restarSaldo" del controlador, 
                            por lo que el error se resolverá allí. */
      //console.error('Error en usuariosService.js: (restarSaldo)', error); //Comunica por consola si el error ocurre aquí.
    }
  }
}

//Exportar la capa de servicio de usuarios.
module.exports = UsuariosService;
