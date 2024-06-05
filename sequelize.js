const { Sequelize } = require('sequelize');
const color = require('colors');

//Crear una nueva instancia de Sequelize:
const sequelize = new Sequelize('bizonbd', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

//Verificar la conexión:
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos exitosa.'.bgGreen);
  })
  .catch(err => {
    console.error('No se puede conectar a la base de datos:'.bgRed, err);
  });

//Exportar la instancia de Sequelize:
module.exports = sequelize;
