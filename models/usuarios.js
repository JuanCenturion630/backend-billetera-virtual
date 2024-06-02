//Importo Sequelize(ORM) y creo una instancia del mismo:
const { Sequelize, DataTypes } = require('sequelize'); //Instancia de la clase Sequelize.
//El "../" significa que sale de la carpeta "models" para ir a la carpeta "backend" donde está "sequelize.js"
const sequelize = require('../sequelize'); //Objeto llamado "sequelize" con los datos de la base de datos.

//Definir el modelo (crea  un objeto que emula a la tabla 'usuarios' en la base de datos):
const usuariosORM = sequelize.define('usuarios', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  dni: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  cuil: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  contrasenia: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cvu: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  alias: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  saldo: {
    type: DataTypes.DECIMAL(9, 2),
    defaultValue: 0
  }
});

//Exportar el modelo de usuario.
module.exports = usuariosORM;
