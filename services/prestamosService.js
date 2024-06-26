const PrestamosRepository = require('../repositories/prestamosRepository'); //Referencio a la clase "transaccionesRepository".
const prestamosRepositorio = new PrestamosRepository();
const UsuarioRepository = require('../repositories/usuariosRepository'); //Referencio a la clase "transaccionesRepository".
const usuariosRepositorio = new UsuarioRepository();
const colors = require('colors');
const io = require('socket.io');

class PrestamosService {
  /**
   * Crea un préstamo en cuotas y con intereses.
   * @param {*} usuario : email, alias o CVU.
   * @param {*} monto : cantidad solicitada.
   * @param {*} cant_cuotas 
   * @returns 
   */  
  async crearPrestamo(usuario, monto, cant_cuotas) {
    try {
      //Busco si el usuario existe:
      const usuarioDatos = await usuariosRepositorio.buscarUsuario(usuario);
      if (!usuarioDatos) throw new Error('Usuario no encontrado para préstamo.');

      //Verifico si el usuario ya tiene un préstamo activo (solo puede tener un préstamo a la vez):
      const prestamoActivo = await prestamosRepositorio.buscarPrestamo(usuarioDatos.id);
      if (prestamoActivo) throw new Error('El usuario ya tiene un préstamo activo.');

      //Calcular el interés y crear el préstamo en caso de no ser deudor:
      let intereses;
      let monto_cuota;
      let vencimiento_cuota = new Date(new Date().setDate(new Date().getDate() + 30));
      let monto_total;
      switch (cant_cuotas) {
        case 3:
          intereses = 5;
          monto_cuota = (monto / cant_cuotas) * 1.05;
          monto_total = monto_cuota * cant_cuotas;
        break;
        case 6:
          intereses = 10;
          monto_cuota = (monto / cant_cuotas) * 1.1;
          monto_total = monto_cuota * cant_cuotas;
        break;
        case 9:
          intereses = 15;
          monto_cuota = (monto / cant_cuotas) * 1.15;
          monto_total = monto_cuota * cant_cuotas;
        break;
        case 12:
          intereses = 20;
          monto_cuota = (monto / cant_cuotas) * 1.20;
          monto_total = monto_cuota * cant_cuotas;
        break;
        default:
          throw new Error('Número de cuotas no válido.');
      }

      const prestamo = await prestamosRepositorio.crearPrestamo(
        usuarioDatos.id,
        monto,
        cant_cuotas,
        intereses,
        monto_cuota,
        vencimiento_cuota,
        monto_total
      );

      //Actualizar saldo del usuario una vez tomado el préstamo:
      if(prestamo) {
        usuarioDatos.saldo += monto;
        await usuarioDatos.save();
        return prestamo;
      }
      else { throw new Error("Falló la creación del préstamo."); }
    }
    catch (error) {
      throw new Error(error);
    }
  }

  /**
   * 
   * @param {*} usuario_id 
   * @returns 
   */
  async pagarCuota(usuario_id) {
    try {
      const prestamo = await prestamosRepositorio.buscarPrestamo(usuario_id);
      if (prestamo) { 
        const usuario = await usuariosRepositorio.buscarUsuario(usuario_id);
        console.log("'usuario' de 'pagarCuota' en el servicio".blue, usuario);
        const saldoInt = parseInt(usuario.saldo, 10);
        const montoCuotaInt = parseInt(prestamo.monto_cuota, 10);
        console.log("Tipo de 'saldoInt':".red, typeof saldoInt);
        console.log("Tipo de 'montoCuotaInt':".red, typeof montoCuotaInt);
        console.log("Viendo 'saldoInt' en 'pagarCuota' del servicio:\n".magenta, saldoInt);
        console.log("Viendo 'montoCuotaInt' en 'pagarCuota' del servicio:\n".yellow, montoCuotaInt);
        if(saldoInt>=montoCuotaInt) { //Si hay saldo suficiente...    
          usuario.saldo -= prestamo.monto_cuota; //Se paga la cuota.
          console.log("'usuario.saldo' después de pagar cuota:\n".green, usuario.saldo);
          await usuario.save();
          prestamo.cuota_actual += 1;
          prestamo.vencimiento_cuota = new Date(new Date().setDate(new Date().getDate() + 30));
          await prestamo.save();
          console.log("'prestamo' de 'pagarCuota' en el servicio:\n".cyan, prestamo);
          return prestamo;
        }
        else { throw new Error("No dispones de suficiente saldo para pagar esta cuota."); } 
      }
      else { throw new Error('¡Felicidades, no adeudas ningún préstamo!'); }
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * 
   * @param {*} usuario_id 
   * @returns 
   */
  async verPrestamo(usuario_id) {
    return prestamosRepositorio.verPrestamos(usuario_id);
  }

  /**
   * 
   */
  async manejarRetrasoPago() {
    const prestamos = await prestamosRepositorio.verPrestamosRetrasados();
    for (const prestamo of prestamos) {
      /**
       * Calcula el número de días de retraso:
       * Se resta la fecha actual (new Date()) y la fecha de vencimiento de la cuota y se convierte la 
       * diferencia de milisegundos a días (1000 mseg * 60 seg * 60 min * 24 hs). 
       * Luego, se redondea hacia abajo con `Math.floor`.
       */
      const diasRetraso = Math.floor((new Date() - new Date(prestamo.vencimiento_cuota)) / (1000 * 60 * 60 * 24));
      
      if (diasRetraso > 0) {
        if(diasRetraso===5) {
          prestamo.intereses += 1; //Los intereses suben un 1% por cada 5 días de retraso.
          prestamo.monto_cuota = prestamo.monto / prestamo.cant_cuotas; //Quito el viejo interés de la cuota.
          prestamo.monto_cuota += prestamo.monto_cuota * prestamo.intereses / 100; //Se asigna el nuevo interés.
          await prestamo.save();
          // Notificar al usuario del retraso a través de Socket.io:
          const usuario = await usuariosRepositorio.buscarUsuario(prestamo.usuario_id);
          io.to(usuario.id).emit(
            'notificacion', 
            `Adeudas una cuota vencida. Interés adicional de ${prestamo.intereses}%`
          );
        }
      }
    }
  }
}

module.exports = PrestamosService;
