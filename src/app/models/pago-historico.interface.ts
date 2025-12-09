/**
 * Detalle de un concepto dentro de un pago
 */
export interface DetalleGasto {
  concepto: string;
  monto: number;
}

/**
 * Método de pago utilizado
 */
export type MetodoPago = 'transferencia' | 'efectivo' | 'cheque' | 'tarjeta' | null;

/**
 * Estado del pago
 */
export type EstadoPago = 'pagado' | 'pendiente' | 'atrasado' | 'parcial';

/**
 * Interfaz que representa un pago histórico
 */
export interface PagoHistorico {
  id: number;
  casaId: number;
  numeroCasa: string;
  mes: string;
  anio: number;
  fechaPago: string | null;
  montoTotal: number;
  metodoPago: MetodoPago;
  estadoPago: EstadoPago;
  detalleGastos: DetalleGasto[];
}
