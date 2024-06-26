const color = require('colors');

//Instancias ORM:
const sequelize = require('./sequelize'); // Referencia al módulo "sequelize" con la conexión a base de datos.
const usuariosORM = require('./models/usuarios'); // Referencia al modelo "usuarios".
const prestamosORM = require('./models/prestamos'); // Referencia al modelo "prestamos".
const transaccionesORM = require('./models/transacciones'); // Referencia al modelo "transacciones".

//Instancias del servidor Express:
const express = require('express');
const cors = require('cors'); //Permite la comunicación del backend con otros dominios.
const app = express(); //Creo una instancia del servidor.
const PORT = process.env.PORT || 8444; //Puerto en el que escuchará el servidor al leer las variables de entorno.

//Configurar rutas:
app.get('/', (req, res) => { res.send('Página por defecto.'); }); //Endpoint por defecto.
const usuariosRouters = require('./routers/usuariosRouter');
const transaccionesRouters = require('./routers/transaccionesRouter');
const prestamosRouters = require('./routers/prestamosRouter');

//Usar rutas:
app.use(cors());
app.use(express.json()); //Convierte las solicitudes del cliente en JSON.
app.use('/usuarios', usuariosRouters);
app.use('/transacciones', transaccionesRouters);
app.use('/prestamos', prestamosRouters);

//Sincronizo los modelos con la base de datos:
async function sincronizarBaseDeDatos() {
  try {
    await sequelize.sync({ alter: true }); // "alter: true" aplica cambios sin borrar datos.
    console.log('Base de datos sincronizada.'.bgGreen);
  } catch (error) {
    console.error('Error al sincronizar la base de datos:'.bgRed, error);
  }
}

//Hago que los modelos ORM se definan y se sincronicen con la base de datos antes de iniciar el servidor.
async function iniciarServidor() {
  try {
    await sincronizarBaseDeDatos();
    app.listen(PORT, () => {
      console.log(`Servidor iniciado en el puerto: ${PORT}.`.bgGreen);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:'.bgRed, error);
  }
}

//HTTPS:
const https = require('https');
const fs = require('fs');
const path = require('path');
const privateKey = fs.readFileSync(path.resolve(__dirname, 'certificates/private.key'), 'utf8');
const certificate = fs.readFileSync(path.resolve(__dirname, 'certificates/certificate.crt'), 'utf8');
const credentials = {
  key: privateKey,
  cert: certificate
};

//Redirigir de HTTP a HTTPS:
const http = require('http');
app.use((req, res, next) => {
  if (!req.secure) { return res.redirect(`https://${req.headers.host}:${8444}${req.url}`); }
  next();
});

//Crear el servidor HTTPS en el puerto 8443 en lugar del 443
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(8443, () => {
  console.log('Servidor HTTPS escuchando en el puerto 8444.');
});

//Crear el servidor HTTP para redireccionar a HTTPS
const httpServer = http.createServer(app);
httpServer.listen(80, () => {
  console.log('Redireccionando HTTP a HTTPS.');
});

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
