//Importo Sequelize(ORM) y creo una instancia del mismo:
const { Sequelize, DataTypes } = require('sequelize'); //Instancia de la clase Sequelize.
//El "../" significa que sale de la carpeta "models" para ir a la carpeta "backend" donde está "sequelize.js"
const sequelize = require('../sequelize'); //Objeto llamado "sequelize" con la conexión a la base de datos.
const usuariosORM = require('./usuarios'); //Importo el modelo "usuarios".

//Definir el modelo (crea  un objeto que emula a la tabla 'prestamos' en la base de datos):
const prestamosORM = sequelize.define('prestamos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: usuariosORM, //Nombre del modelo (abstracción de la tabla "usuarios").
        key: 'id' //Clave primaria del modelo.
    }
  },
  monto: {
    type: DataTypes.DECIMAL(9, 2),
    defaultValue: 0
  },
  cant_cuotas: {
    type: DataTypes.TINYINT,
    defaultValue: 1
  },
  intereses: {
    type: DataTypes.TINYINT,
    defaultValue: 0
  },
  monto_cuota: {
    type: DataTypes.DECIMAL(9,2),
    defaultValue: 0
  },
  cuota_actual: {
    type: DataTypes.TINYINT,
    defaultValue: 1
  },
  vencimiento_cuota: {
    type: DataTypes.DATEONLY, //Solo da la fecha sin hora.
  },
  monto_total: {
    type: DataTypes.DECIMAL(9, 2),
    defaultValue: 0
  }
});

//Exportar el modelo de préstamos.
module.exports = prestamosORM;
