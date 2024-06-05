const color = require('colors');

//ORM:
const sequelize = require('./sequelize'); //Referencia al módulo "sequelize" con la conexión a base de datos.
const usuariosORM = require('./models/usuarios'); //Referencia al modelo "usuarios".
const prestamosORM = require('./models/prestamos'); //Referencia al modelo "prestamos".
const transaccionesORM = require('./models/transacciones'); //Referencia al modelo "transacciones".

//AWS-Cognito:
const cors = require('cors');
const verifyToken = require("./middleware/verifyToken");

//Servidor Express:
const express = require('express'); //Referencia al módulo express.
const app = express(); //Creo una instancia del servidor.
const PORT = process.env.PORT || 3000; //Puerto en el que escuchará el servidor.

//Configurar rutas:
app.get('/', (res) => { res.send('A ver dijo el ciego.'); }); //Endpoint por defecto.
const usuariosRouters = require('./routers/usuariosRouter');
const transaccionesRouters = require('./routers/transaccionesRouter');

//Usar rutas: app.use(cors());
app.use(express.json()); //Convierte las solicitudes del cliente en JSON.
app.use('/usuarios', usuariosRouters);
app.use('/transacciones', transaccionesRouters);

//Sincronizo los modelos con la base de datos:
async function sincronizarBaseDeDatos() {
    try {
        await sequelize.sync({ alter: true }); //"alter: true" aplica cambios sin borrar datos.
        console.log('Base de datos sincronizada.'.bgGreen);
    } catch (error) {
        console.error('Error al sincronizar la base de datos:'.bgRed, error);
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
        console.log(`Servidor iniciado en el puerto: ${PORT}.`.bgGreen);
      });
    } catch (error) {
      console.error('Error al iniciar el servidor:'.bgRed, error);
    }
}

iniciarServidor();