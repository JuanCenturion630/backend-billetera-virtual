const prestamosORM = require('../models/prestamos');
const { Op: operadoresLogicos } = require('sequelize'); //Op debe estar entre corchetes sí o sí.
const Sequelize = require('sequelize'); //Representa a la clase "Sequelize"

class PrestamosRepository {
    /**
     * Busca préstamos activos del usuario.
     * @param {*} usuario_id 
     * @returns 
     */
    async buscarPrestamo(usuario_id) {
        try {
            return await prestamosORM.findOne({ 
                where: { 
                    usuario_id: usuario_id, 
                    cuota_actual: { //Si la cuota actual es menor o igual a la cantidad de cuotas, el préstamo aún no ha terminado de pagarse.
                        [operadoresLogicos.lte]: Sequelize.col('cant_cuotas')
                    }
                }
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * 
     * @param {*} usuario_id 
     * @param {*} monto : préstamo solicitado.
     * @param {*} cant_cuotas : cuotas solicitadas.
     * @param {*} interes : interés asignado.
     * @param {*} monto_cuota : cuota después del interés.
     * @param {*} vencimiento_cuota : vencimiento de la cuota.
     * @param {*} monto_total : total a devolver.
     * @returns 
     */
    async crearPrestamo(usuario_id,monto,cant_cuotas,intereses,monto_cuota,vencimiento_cuota,monto_total) {
        try {
            return await prestamosORM.create({
                usuario_id: usuario_id,
                monto: monto,
                cant_cuotas: cant_cuotas,
                intereses: intereses,
                monto_cuota: monto_cuota,
                cuota_actual: 1,
                vencimiento_cuota: vencimiento_cuota,
                monto_total: monto_total
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * 
     * @param {*} usuario_id 
     * @returns 
     */
    async verPrestamos(usuario_id) {
        try {
            return await prestamosORM.findAll({ 
                where: { 
                    usuario_id: usuario_id 
                } 
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    async verPrestamoRetrasado(usuario_id) {
        try {
            return await prestamosORM.findOne({
                where: {
                    usuario_id: usuario_id,
                    vencimiento_cuota: { 
                        [operadoresLogicos.lt]: new Date() //"vencimiento_cuota" es menor a la fecha actual, es decir, ya pasó, ya venció.
                    }
                }
            });
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = PrestamosRepository;