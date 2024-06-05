//Controller es la API que conecta el frontend con el back (capa services/repository/models).
//Debe ser limitada a solo recibir o emitir archivos JSON o XML. Si hace más cosas, viola la arquitectura.

const UsuariosService = require('../services/usuariosService'); //Importar la clase "usuariosService".
const usuarioServicio = new UsuariosService(); //Instanciar la clase "usuariosService".

class UsuariosController {
  /**
   * Controla la conexión del front con crear usuarios.
   * @param {*} req: JSON que recibe del frontend.
   * @param {*} res: JSON que se envía al frontend.
   */
  async crearUsuario(req, res) {
    try {
      const { nombre, apellido, email, dni, cuil, contrasenia } = req.body; //Obtener los datos del cuerpo JSON.
      const nuevoUsuario = await usuarioServicio.crearUsuario(nombre, apellido, email, dni, cuil, contrasenia); //Llamar a services.
      res.status(201).json({ //Enviar respuesta al cliente. 
        descripcion: "Usuario creado exitosamente.", 
        usuario: nuevoUsuario 
      });
    } catch (error) {
      res.status(501).json({ 
        descripcion: "Error al crear el usuario.",
        detalles: error.message
      }); //El controlador por fallo propio, o fallo de su servicio o repositorio, envia un JSON al cliente.
      //console.error('Error en usuariosController.js (crearUsuario):', error); //Comunica por consola si el error ocurre aquí.
    }
  }

  /**
   * Controla la conexión del front con logearse.
   * @param {*} req: JSON que recibe del frontend.
   * @param {*} res: JSON que se envía al frontend.
   */
  async login(req, res) {
    try {
      const { email, contrasenia } = req.body;
      const logearUsuario = await usuarioServicio.login(email,contrasenia);
      res.status(201).json({ 
        descripcion: "Ha iniciado sesión con éxito.",
        usuario: logearUsuario
      });
    } catch (error) {
      res.status(401).json({ 
        descripcion: "Error al intentar iniciar sesión.",
        detalles: error.message
      });
      //console.error('Error en usuariosController.js (login):', error); //Comunica por consola si el error ocurre aquí.
    }
  }

  /**
   * Controla la conexión del front con buscar usuarios.
   * @param {*} req: JSON que recibe del frontend.
   * @param {*} res: JSON que se envía al frontend.
   */
  async buscarUsuario(req, res) {
    try {
      const { busqueda } = req.body;
      const resultado = await usuarioServicio.buscarUsuario(busqueda);
      res.status(201).json({
        descripcion: "Resultados encontrados.",
        busqueda: resultado
      });
    } catch (error) {
      res.status(401).json({ 
        descripcion: "Error al buscar elemento.",
        detalles: error.message
      });
      //console.error('Error en usuariosController.js (buscarUsuario):', error); //Comunica por consola si el error ocurre aquí.
    }
  }

  /**
   * Controla la conexión del front con listar usuarios.
   * @param {*} req: JSON que recibe del frontend.
   * @param {*} res: JSON que se envía al frontend.
   */
  async listarUsuariosExcluyendoLogeado(req, res) {
    try {
      const { idUsuarioLogeado } = req.body;
      const listadoUsuarios = await usuarioServicio.listarUsuariosExcluyendoLogeado(idUsuarioLogeado);
      res.status(201).json({
        descripcion: "Listado de usuarios.",
        busqueda: listadoUsuarios
      });
    } catch (error) {
      res.status(401).json({ 
        descripcion: "Error al mostrar el listado de usuarios.",
        detalles: error.message
      });
      //console.error('Error en usuariosController.js (listarUsuariosExcluyendoLogeado):', error);
    }
  }

  /**
   * Controla la conexión del front con tranferir saldo entre usuarios.
   * @param {*} req: JSON que recibe del frontend.
   * @param {*} res: JSON que se envía al frontend.
   */
  async transferirSaldo(req, res) {
    try {
      const { emisor, receptor, monto } = req.body;
      const resultado = await usuarioServicio.transferirSaldo(emisor, receptor, monto);
      res.status(201).json({
        descripcion: "Transferencia exitosa.",
        transferencia: resultado
      });
    } catch(error) {
      res.status(401).json({ 
        descripcion: "Error al transferir saldo.",
        detalles: error.message
      });
      //console.error('Error en usuariosController.js (transferirSaldo):', error); //Comunica por consola si el error ocurre aquí.
    }
  }

  /**
   * Controla la conexión del front con tranferir saldo entre usuarios.
   * @param {*} req: JSON que recibe del frontend.
   * @param {*} res: JSON que se envía al frontend.
   */
  async sumarSaldo(req, res) {
    try {
      const { usuario, saldo } = req.body;
      const resultado = await usuarioServicio.sumarSaldo(usuario, saldo);
      res.status(201).json({
        usuario: usuario,
        saldo: resultado
      });
    } catch(error) {
      res.status(401).json({ 
        descripcion: "Error al agregar saldo.",
        detalles: error.message
      });
      //console.error('Error en usuariosController.js (sumarSaldo):', error); //Comunica por consola si el error ocurre aquí.
    }
  }
}

module.exports = UsuariosController;