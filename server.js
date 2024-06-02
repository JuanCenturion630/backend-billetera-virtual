const sequelize = require('./sequelize'); //Referencia al módulo "sequelize" con la conexión a base de datos.
const usuariosORM = require('./models/usuarios'); //Referencia al modelo "usuarios".
const prestamosORM = require('./models/prestamos'); //Referencia al modelo "prestamos".
const transaccionesORM = require('./models/transacciones'); //Referencia al modelo "transacciones".
const express = require('express'); //Referencia al módulo express.
const app = express(); //Creo una instancia del servidor.
const PORT = process.env.PORT || 3000; //Puerto en el que escuchará el servidor.
const usuariosController = require('./controllers/usuariosController'); //Importo mi controlador para crear su endpoint (su ruta personal que le asigna el servidor).
console.log("error choto: ",usuariosController); //Prueba.

//#region Endpoints:

  app.use(express.json()); //Convierte las solicitudes del cliente en JSON.
  app.get('/', (req, res) => { res.send('A ver dijo el ciego.'); }); //Endpoint por defecto.
  app.post('/usuarios', (req, res) => usuariosController.crearUsuario(req, res)); //Endpoint de crear usuario.
//#endregion

//Sincronizo los modelos con la base de datos:
async function sincronizarBaseDeDatos() {
    try {
        await sequelize.sync({ alter: true }); //"alter: true" aplica cambios sin borrar datos.
        console.log('Base de datos sincronizada.');
    } catch (error) {
        console.error('Error al sincronizar la base de datos:', error);
    }
}

//Hago que los modelos ORM se definan y se sincronicen con la base de datos antes de iniciar el servidor.
async function iniciarServidor() {
    try {
      await usuariosORM.sync();
      await prestamosORM.sync();
      await transaccionesORM.sync();
      await sincronizarBaseDeDatos();
      app.listen(PORT, () => {
        console.log(`Servidor iniciado en el puerto: ${PORT}.`);
      });
    } catch (error) {
      console.error('Error al iniciar el servidor:', error);
    }
}

iniciarServidor();