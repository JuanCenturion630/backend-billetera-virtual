const colors = require('colors');

//Instancias ORM:
const sequelize = require('./sequelize'); // Referencia al módulo "sequelize" con la conexión a base de datos.

//Instancias de la aplicación en Express:
const express = require('express');
const cors = require('cors');
const app = express(); //Creo una instancia de mi aplicación.
const miPuerto = process.env.PORT || 3000; //Puerto personalizado en las variables de entorno.

//Construyo credenciales HTTPS:
const https = require('https');
const fs = require('fs'); //Permite leer manipular archivos del sistema.
const path = require('path'); //Permite buscar archivos del sistema.
const privateKey = fs.readFileSync(path.resolve(__dirname, 'certificates/private.key'), 'utf8');
const certificate = fs.readFileSync(path.resolve(__dirname, 'certificates/certificate.crt'), 'utf8');
const credentials = { key: privateKey, cert: certificate };

//Configurar rutas de la aplicación en Express:
app.use(cors()); //Permite la comunicación con dominios distintos al backend.
app.use(express.json()); //Convierte las solicitudes del cliente en JSON.
app.get('/', (req, res) => { res.send('Página por defecto.'); }); //Endpoint por defecto.
const usuariosRouters = require('./routers/usuariosRouter');
const transaccionesRouters = require('./routers/transaccionesRouter');
const prestamosRouters = require('./routers/prestamosRouter');
app.use('/usuarios', usuariosRouters);
app.use('/transacciones', transaccionesRouters);
app.use('/prestamos', prestamosRouters);

//Sincronizar los modelos con la base de datos:
async function sincronizarBaseDeDatos() {
  try {
    await sequelize.sync({ alter: true }); //"alter: true" aplica cambios sin borrar datos.
    console.log('Base de datos sincronizada.'.bgGreen);
  } 
  catch (error) { console.error('Error al sincronizar la base de datos:'.bgRed, error); }
}

//Iniciar el servidor:
async function iniciarServidor() {
  try {
    await sincronizarBaseDeDatos();
    servidorHttps.listen(8444, () => { console.log('Servidor HTTPS escuchando en el puerto 8444.'.bgGreen); });
    servidorHttp.listen(miPuerto, () => { console.log('Redireccionando HTTP a HTTPS.'.bgGreen); });
  } 
  catch (error) { console.error('Error al iniciar el servidor:'.bgRed, error); }
}

//Crear el servidor HTTPS:
const servidorHttps = https.createServer(credentials, app);

//Crear el servidor HTTP para redireccionar a HTTPS:
const http = require('http');
const appHttp = express();
appHttp.use((req, res) => { res.redirect(`https://${req.hostname}:8444${req.url}`); });
const servidorHttp = http.createServer(appHttp);

//Inicio del servidor:
iniciarServidor();

//#region Configuración de Socket.io:

/* const http = require('http');
const socketIo = require('socket.io');
const PrestamosService = require('./services/prestamosService');
const prestamosServicio = new PrestamosService();

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado.');
  socket.on('disconnect', () => {
    console.log('Cliente desconectado.');
  });
});

//Middleware para agregar `io` a `req`
app.use((req, res, next) => {
  req.io = io;
  next();
});

//Manejo retrasos en cuotas:
setInterval(async () => {
  await prestamosServicio.manejarRetrasoPago();
}, 86400000); //1 día en milisegundos. */

//#endregion
