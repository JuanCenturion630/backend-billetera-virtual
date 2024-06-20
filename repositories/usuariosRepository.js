//Se encarga de interactuar con el modelo "usuario" (abstracción de tabla "usuarios" en base de datos).
//Debe solo invocar métodos ORM que emulen sentencias SQL y hacer returns. Si hace más cosas, viola la arquitectura.

const color = require('colors');
const usuariosORM = require('../models/usuarios');
const { Op: operadoresLogicos } = require('sequelize'); //Op debe estar entre corchetes sí o sí.
const Sequelize = require('sequelize'); //Representa a la clase "Sequelize"
const sequelize = require('../sequelize'); //Representa al archivo "sequelize.js" que contiene un objeto de la clase Sequelize pero con el nombre de la base de datos, el usuario root y la contraseña.

class UsuariosRepository {
    /**
     * Ejecuta un ORM para insertar un nuevo usuario en la base de datos.
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
            /* Realiza un "INSERT INTO usuarios VALUES(nombre,apellido...)" pero con ORM, con "await" esperando 
            la respuesta y se retorna. */
            return await usuariosORM.create({ 
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
        } catch (error) {
            //console.error('Error en usuariosRepository.js (crearUsuario):', error);
            /* El throw realiza una llamada ascendente para la resolución del error, es decir, la resolución 
            del error se terceriza a la función que llamó a esta. Esta es "crearUsuarios" del repositorio, 
            que es llamada por "crearUsuario" del servicio, por lo que el error se resolverá allí. */
            throw new Error(error);
        }
    } //FUNCIONA.

    /**
     * Ejecuta un ORM para buscar el usuario registrado en la base de datos.
     * @param {*} email 
     * @param {*} contrasenia 
     * @returns 
     */
    async login(email, contrasenia) {
        try {
            /* Realiza un "SELECT * FROM usuarios WHERE email=email AND cotrasenia=contrasenia LIMIT 1" pero con ORM, 
            con "await" esperando la respuesta y se retorna. */
            return await usuariosORM.findOne({ 
                where: { 
                    email: email,
                    contrasenia: contrasenia
                }
            });
        } catch (error) {
            //console.error('Error en usuariosRepository.js (login):', error);
            /* El throw realiza una llamada ascendente para la resolución del error, es decir, la resolución 
            del error se terceriza a la función que llamó a esta. Esta es "login" del repositorio, 
            que es llamada por "login" del servicio, por lo que el error se resolverá allí. */
            throw new Error(error);
        }
    } //FUNCIONA.

    /**
     * Ejecuta un ORM para buscar los usuarios.
     * @param {*} busqueda : email, alias o CVU.
     * @returns : devuelve un objeto con todos los datos del usuario encontrado.
     */
    async buscarUsuario(busqueda) {
        try {
            /* Realiza un "SELECT * FROM usuarios WHERE email=busqueda OR alias=busqueda OR cvu=busqueda" pero 
            con ORM, con "await" esperando la respuesta y se retorna. */
            return await usuariosORM.findAll({ 
                where: { 
                    [operadoresLogicos.or]: [
                        { email: busqueda },
                        { alias: busqueda },
                        { cvu: busqueda }
                    ]
                }
            });
        } catch (error) {
            //console.error('Error en usuariosRepository.js (buscarUsuario):', error);
            /* El throw realiza una llamada ascendente para la resolución del error, es decir, la resolución 
            del error se terceriza a la función que llamó a esta. Esta es "buscarUsuario" del repositorio, 
            que es llamada por "buscarUsuario" del servicio, por lo que el error se resolverá allí. */
            throw new Error(error);
        }
    } //FUNCIONA.

    /**
     * Ejecuta un ORM para buscar el id del usuario.
     * @param {*} busqueda : email, alias o CVU.
     * @returns : devuelve un objeto solo el id del usuario encontrado.
     */
    async buscarID(busqueda) {
        try {
            /* Realiza un "SELECT id FROM usuarios WHERE email=busqueda OR alias=busqueda OR cvu=busqueda" pero 
            con ORM, con "await" esperando la respuesta y se retorna. */
            return await usuariosORM.findOne({ 
                where: { 
                    [operadoresLogicos.or]: [
                        { email: busqueda },
                        { alias: busqueda },
                        { cvu: busqueda }
                    ]
                },
                attributes: ['id']
            });
        } catch (error) {
            //console.error('Error en usuariosRepository.js (buscarID):', error);
            /* El throw realiza una llamada ascendente para la resolución del error, es decir, la resolución 
            del error se terceriza a la función que llamó a esta. Esta es "buscarID" del repositorio, 
            que es llamada por "buscarID" del servicio, por lo que el error se resolverá allí. */
            throw new Error(error);
        }
    } //FUNCIONA.

    /**
     * 
     * @param {*} idUsuarioLogeado : id del usuario que inició la aplicación.
     * @returns : muestra todos los usuarios excepto el usuario logeado.
     */
    async listarUsuariosExcluyendoLogeado(idUsuarioLogeado) {
        try {
            /* Realiza un "SELECT * FROM usuarios WHERE id!=idUsuarioLogeado pero con ORM, con "await" esperando 
            la respuesta y se retorna. */
            return await usuariosORM.findAll(
                {
                    where: {
                      id: {
                        [operadoresLogicos.ne]: idUsuarioLogeado
                      }
                    }
                }
            );
        } catch (error) {
            //console.error('Error en usuariosRepository.js (mostrarTodosLosUsuarios):', error);
            /* El throw realiza una llamada ascendente para la resolución del error, es decir, la resolución 
            del error se terceriza a la función que llamó a esta. Esta es "listarUsuariosExcluyendoLogeado" 
            del repositorio, que es llamada por "listarUsuariosExcluyendoLogeado" del servicio, 
            por lo que el error se resolverá allí. */
            throw new Error(error);
        }
    } //FUNCIONA.

    /**
     * Ejecuta un ORM para transferir saldo de un usuario a otro.
     * @param {*} emisor: email, alias o CVU del usuario emisor.
     * @param {*} receptor: email, alias o CVU del usuario receptor.
     * @param {*} monto
     * @returns: Devuelve un JSON con información de la transferencia.
     */
    async transferirSaldo(emisor,receptor,monto) {
        //En SQL y ORM la transacción se usa para ligar consultas.
        //Las consultas se ejecutan en caché y si una falla, la transacción no continua.
        const transaccionSaldo = await sequelize.transaction();
        
        try {
            //UPDATE saldo=saldo-monto WHERE email=emisor OR cvu=emisor OR alias=emisor (resta saldo al emisor).
            await usuariosORM.update(
                { saldo: Sequelize.literal(`saldo - ${monto}`) },
                { 
                    where: {
                        [operadoresLogicos.or]: [
                            { id: emisor },
                            { alias: emisor },
                            { cvu: emisor }
                        ]
                    },
                    transaction: transaccionSaldo
                }
            );

            //UPDATE saldo=saldo+monto WHERE email=receptor OR alias=receptor OR cvu=receptor (resta saldo al receptor).
            await usuariosORM.update(
                { saldo: Sequelize.literal(`saldo + ${monto}`) },
                { 
                    where: {
                        [operadoresLogicos.or]: [
                            { email: receptor },
                            { alias: receptor },
                            { cvu: receptor }
                        ]
                    },
                    transaction: transaccionSaldo
                }
            );

            await transaccionSaldo.commit(); //Guarda los cambios ocurridos durante la transacción.
            return { 
                emisor: emisor, 
                receptor: receptor,
                monto: monto,
                message: 'Se completó la transferencia con éxito.' 
            };
        } catch (error) {
            await transaccionSaldo.rollback(); //Revierte la transacción si esta se aborta repentinamente.
            //console.error('Error en usuariosRepository.js (transferirSaldo):'.bgRed, error);
            /* El throw realiza una llamada ascendente para la resolución del error, es decir, la resolución 
            del error se terceriza a la función que llamó a esta. Esta es "transferirSaldo" del repositorio, 
            que es llamada por "transferirSaldo" del servicio, por lo que el error se resolverá allí. */
            throw new Error(error);
        }
    } //FUNCIONA (no valida si el saldo es 0).

    /**
     * Ejecuta un ORM para sumar saldo a un usuario.
     * @param {*} usuario 
     * @param {*} saldo 
     */
    async sumarSaldo(usuario,monto) {
        try {
            //UPDATE saldo=saldo+monto WHERE email=emisor OR cvu=emisor OR alias=emisor (resta saldo al emisor).
            return await usuariosORM.update(
                { saldo: Sequelize.literal(`saldo + ${monto}`) },
                { 
                    where: {
                        [operadoresLogicos.or]: [
                            { email: usuario },
                            { alias: usuario },
                            { cvu: usuario }
                        ]
                    }
                }
            );
        } catch (error) {
            //console.error('Error en usuariosRepository.js (sumarSaldo):'.bgRed, error);
            /* El throw realiza una llamada ascendente para la resolución del error, es decir, la resolución 
            del error se terceriza a la función que llamó a esta. Esta es "sumarSaldo" del repositorio, 
            que es llamada por "sumarSaldo" del servicio, por lo que el error se resolverá allí. */
            throw new Error(error);
        }
    } //FUNCIONA.

    /**
     * Ejecuta un ORM para restar saldo a un usuario.
     * @param {*} usuario 
     * @param {*} saldo 
     */
    async restarSaldo(usuario,monto) {
        try {
            //UPDATE saldo=saldo+monto WHERE email=emisor OR cvu=emisor OR alias=emisor (resta saldo al emisor).
            return await usuariosORM.update(
                { saldo: Sequelize.literal(`saldo - ${monto}`) },
                { 
                    where: {
                        [operadoresLogicos.or]: [
                            { email: usuario },
                            { alias: usuario },
                            { cvu: usuario }
                        ]
                    }
                }
            );
        } catch (error) {
            //console.error('Error en usuariosRepository.js (sumarSaldo):'.bgRed, error);
            /* El throw realiza una llamada ascendente para la resolución del error, es decir, la resolución 
            del error se terceriza a la función que llamó a esta. Esta es "sumarSaldo" del repositorio, 
            que es llamada por "sumarSaldo" del servicio, por lo que el error se resolverá allí. */
            throw new Error(error);
        }
    } //FUNCIONA.
}

module.exports = UsuariosRepository;