//Importo Sequelize(ORM) y creo una instancia del mismo:
const { Sequelize, DataTypes } = require('sequelize'); //Instancia de la clase Sequelize.
//El "../" significa que sale de la carpeta "models" para ir a la carpeta "backend" donde está "sequelize.js"
const sequelize = require('../sequelize'); //Objeto llamado "sequelize" con los datos de la base de datos.
const usuariosORM = require('./usuarios'); //Importo el modelo "usuarios".

//Definir el modelo (crea  un objeto que emula a la tabla 'usuarios' en la base de datos):
const transaccionesORM = sequelize.define('transacciones', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false
  },
  monto: {
    type: DataTypes.DECIMAL(9, 2),
    defaultValue: 0
  },
  descripcion: {
    type: DataTypes.STRING
  },
  categoria: {
    type: DataTypes.STRING
  },
  emisor_id: {
    type: DataTypes.INTEGER,
    references: {
        model: usuariosORM, //Nombre del modelo (abstracción de la tabla "usuarios").
        key: 'id' //Clave primaria del modelo.
    }
  },
  receptor_id: {
    type: DataTypes.INTEGER,
    references: {
        model: usuariosORM, //Nombre del modelo (abstracción de la tabla "usuarios").
        key: 'id' //Clave primaria del modelo.
    }
  }
});

//Exportar el modelo de transacciones.
module.exports = transaccionesORM;
