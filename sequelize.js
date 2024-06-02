const { Sequelize } = require('sequelize');

//Crear una nueva instancia de Sequelize:
const sequelize = new Sequelize('bizonbd', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: console.log //Ver los logs de las consultas SQL (para ver si la conexión existe).
});

//Verificar la conexión:
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos exitosa.');
  })
  .catch(err => {
    console.error('No se puede conectar a la base de datos:', err);
  });

//Exportar la instancia de Sequelize:
module.exports = sequelize;
