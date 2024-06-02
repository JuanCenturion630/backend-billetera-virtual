//Incluye a todos los métodos CRUD para interactuar con el modelo "usuario" 
//(abstracción de la tabla "usuarios" en base de datos):

const usuariosORM = require('../models/usuarios');

class UsuariosRepository {
    /**
     * 
     * @param {*} nombre: nombre del usuario. 
     * @param {*} apellido: apellido del usuario.
     * @param {*} email: email del usuario (220 carácteres).
     * @param {*} dni: D.N.I. (8 carácteres sin puntos ni espacios).
     * @param {*} cuil: C.U.I.L. (11 carácteres sin puntos ni espacios).
     * @param {*} contrasenia: 255 carácteres.
     * @returns retorna un nuevo usuario en la base de datos.
     */
    async crearUsuario(nombre, apellido, email, dni, cuil, contrasenia, cvu, alias, saldo) {
        try {
            const nuevoUsuario = await usuariosORM.create({ //Crear usuario usando ORM.
                nombre,
                apellido,
                email,
                dni,
                cuil,
                contrasenia,
                cvu,
                alias,
                saldo
            });
            console.log('Usuario creado en UsuariosRepository:', nuevoUsuario); //Prueba.
            return nuevoUsuario;
        } catch (error) {
            console.error('Error en UsuariosRepository:', error); //Prueba.
            throw new Error('Error al crear el usuario: ' + error.message);
        }
    }

    //Pendiente métodos para borrar y editar usuarios en repository...
}

module.exports = UsuariosRepository;