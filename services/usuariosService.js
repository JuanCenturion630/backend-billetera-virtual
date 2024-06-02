//Se encarga de la lógica de negocios destinada a interactuar con los repositorios y modelos de "usuarios."

const UsuariosRepository = require('../repositories/usuariosRepository'); //Referencio a la clase "usuariosRepository".
const usuarioRepo = new UsuariosRepository(); //Instacio a la clase "usuarioRepository".

class UsuariosService {
  //El "crearUsuario" (service) aplica lógica de negocios (validaciones y demás) y solo después llama a 
  //"crearUsuario" (repository) que realiza un CRUD en los modelos que a su vez impactan en la base de datos.
  async crearUsuario(nombre, apellido, email, dni, cuil, contrasenia) {
    try {
      //Falta lógica de negocio... (método para generar cvu y alias, por ejemplo).
      console.log('Datos de usuariosController:', { nombre, apellido, email, dni, cuil, contrasenia }); //Prueba.
      let cvu="11111111";
      let alias="ramon.perez.simancas.bz";
      let saldo="0";
      const nuevoUsuario = await usuarioRepo.crearUsuario(nombre, apellido, email, dni, cuil, contrasenia, cvu, alias, saldo);
      console.log('Usuario creado en usuariosService:', nuevoUsuario); //Prueba.
      return nuevoUsuario;
    } catch (error) {
      throw new Error('Error al crear el usuario: ' + error.message);
    }
  }

  //Pendientes métodos para borrar y editar usuarios en service.
}

// Exportar la capa de servicio de usuarios
module.exports = UsuariosService;
