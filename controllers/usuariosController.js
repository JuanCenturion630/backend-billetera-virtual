//Controller es la API que conecta el frontend con el back (capa services/repository/models).

const UsuariosService = require('../services/usuariosService'); //Importar la clase "usuariosService".
const usuariosServ = new UsuariosService(); //Instanciar la clase "usuariosService".

class UsuariosController {
  // Controlador para manejar la creación de un nuevo usuario
  async crearUsuario(req, res) {
    try {
      const { nombre, apellido, email, dni, cuil, contrasenia } = req.body; // Obtener los datos del cuerpo JSON.
      const nuevoUsuario = await usuariosServ.crearUsuario(nombre, apellido, email, dni, cuil, contrasenia); //Llamar a services.
      res.status(201).json({ //Enviar respuesta al navegador. 
        mensaje: 'Usuario creado exitosamente', 
        usuario: nuevoUsuario 
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el usuario: ' + error.message });
    }
  }

  //Pendientes controladores para editar y eliminar usuarios.
}

module.exports = UsuariosController;
