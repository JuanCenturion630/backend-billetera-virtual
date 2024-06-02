//Importo Sequelize(ORM) y creo una instancia del mismo:
const { Sequelize, DataTypes } = require('sequelize'); //Instancia de la clase Sequelize.
//El "../" significa que sale de la carpeta "models" para ir a la carpeta "backend" donde está "sequelize.js"
const sequelize = require('../sequelize'); //Objeto llamado "sequelize" con los datos de la base de datos.
const usuariosORM = require('./usuarios'); //Importo el modelo "usuarios".

//Definir el modelo (crea  un objeto que emula a la tabla 'usuarios' en la base de datos):
const prestamosORM = sequelize.define('prestamos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  monto_pedido: {
    type: DataTypes.DECIMAL(9, 2),
    defaultValue: 0
  },
  monto_total: {
    type: DataTypes.DECIMAL(9, 2),
    defaultValue: 0
  },
  cantidad_cuotas: {
    type: DataTypes.TINYINT,
    defaultValue: 0
  },
  fecha_vencimiento: {
    type: DataTypes.DATEONLY, //Solo da la fecha sin hora.
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    references: {
        model: usuariosORM, // Nombre del modelo (abstracción de la tabla "usuarios").
        key: 'id' // Clave primaria del modelo.
    }
  }
});

//Exportar el modelo de préstamos.
module.exports = prestamosORM;
