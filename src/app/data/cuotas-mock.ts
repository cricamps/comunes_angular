import { Cuota } from '../models/cuota.model';

/**
 * Cuotas mock para pruebas y desarrollo
 * 
 * Genera cuotas de los últimos 12 meses para cada casa.
 * Algunas están pagadas, otras pendientes y otras vencidas.
 */

/**
 * Generar cuotas por casa
 * 
 * IMPORTANTE: Ahora verifica en localStorage si hay cuotas pagadas
 * para no mostrarlas como pendientes.
 */
export function generarCuotasPorCasa(pasaje: string, casa: string): Cuota[] {
  const cuotas: Cuota[] = [];
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const anioActual = 2024;
  const mesActual = 10; // Noviembre (índice 10)

  // Obtener cuotas pagadas de localStorage
  const cuotasPagadasIds = obtenerCuotasPagadasIds(pasaje, casa);

  meses.forEach((mes, index) => {
    const id = parseInt(`${pasaje}${casa.charCodeAt(0)}${index}`);
    
    // Si esta cuota ya fue pagada, no la incluimos
    if (cuotasPagadasIds.includes(id)) {
      return;
    }

    const fechaVencimiento = new Date(anioActual, index + 1, 0); // Último día del mes
    const hoy = new Date();
    
    // Determinar estado
    let estado: 'pendiente' | 'pagada' | 'vencida';
    let fechaPago: Date | undefined;
    let metodoPago: string | undefined;

    if (index < mesActual - 3) {
      // Meses antiguos: pagados
      estado = 'pagada';
      fechaPago = new Date(anioActual, index + 1, 5); // Pagado el 5 del mes siguiente
      metodoPago = 'Transferencia';
    } else if (index < mesActual) {
      // Meses recientes: algunos pendientes, algunos vencidos
      if (fechaVencimiento < hoy) {
        estado = 'vencida';
      } else {
        estado = 'pendiente';
      }
    } else if (index === mesActual) {
      // Mes actual: pendiente
      estado = 'pendiente';
    } else {
      // Meses futuros: no generamos
      return;
    }

    cuotas.push({
      id,
      mes,
      anio: anioActual,
      monto: 5000, // $5,000 por casa
      estado,
      fechaVencimiento,
      pasaje,
      casa,
      fechaPago,
      metodoPago
    });
  });

  return cuotas;
}

/**
 * Obtener IDs de cuotas pagadas desde localStorage
 * 
 * Lee el historial de pagos y extrae los IDs de cuotas
 * que ya fueron pagadas por esta casa.
 */
function obtenerCuotasPagadasIds(pasaje: string, casa: string): number[] {
  const pagosStr = localStorage.getItem('pagos');
  if (!pagosStr) return [];

  try {
    const pagos = JSON.parse(pagosStr);
    const cuotasPagadasIds: number[] = [];

    pagos.forEach((pago: any) => {
      if (pago.pasaje === pasaje && pago.casa === casa && pago.cuotaId) {
        cuotasPagadasIds.push(pago.cuotaId);
      }
    });

    return cuotasPagadasIds;
  } catch (error) {
    console.error('Error al leer pagos:', error);
    return [];
  }
}

// Ejemplo de cuotas para el usuario de prueba (Pasaje 8651, Casa B)
export const CUOTAS_MOCK: Cuota[] = generarCuotasPorCasa('8651', 'B');

// Función helper para obtener cuotas por casa
export function obtenerCuotasPorCasa(pasaje: string, casa: string): Cuota[] {
  return generarCuotasPorCasa(pasaje, casa);
}

// Función helper para obtener cuotas pendientes
export function obtenerCuotasPendientes(pasaje: string, casa: string): Cuota[] {
  return generarCuotasPorCasa(pasaje, casa).filter(c => 
    c.estado === 'pendiente' || c.estado === 'vencida'
  );
}

// Función helper para obtener cuotas pagadas
export function obtenerCuotasPagadas(pasaje: string, casa: string): Cuota[] {
  return generarCuotasPorCasa(pasaje, casa).filter(c => c.estado === 'pagada');
}
