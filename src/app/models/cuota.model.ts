/**
 * Modelo de Cuota de Gasto Común
 * 
 * Representa una cuota mensual de gastos comunes que un residente debe pagar.
 * 
 * @example
 * ```typescript
 * const cuota: Cuota = {
 *   id: 1,
 *   mes: 'Enero',
 *   año: 2024,
 *   monto: 5000,
 *   estado: 'pendiente',
 *   fechaVencimiento: new Date('2024-01-31'),
 *   pasaje: '8651',
 *   casa: 'A'
 * };
 * ```
 */
export interface Cuota {
  /** Identificador único de la cuota */
  id: number;
  
  /** Mes de la cuota (Enero, Febrero, etc.) */
  mes: string;
  
  /** Año de la cuota */
  año: number;
  
  /** Monto a pagar por la cuota */
  monto: number;
  
  /** Estado de la cuota: 'pendiente', 'pagada' o 'vencida' */
  estado: 'pendiente' | 'pagada' | 'vencida';
  
  /** Fecha de vencimiento de la cuota */
  fechaVencimiento: Date;
  
  /** Número del pasaje (8651 o 8707) */
  pasaje: string;
  
  /** Letra de la casa (A-G) */
  casa: string;
  
  /** Fecha de pago (solo si está pagada) */
  fechaPago?: Date;
  
  /** Método de pago (solo si está pagada) */
  metodoPago?: string;
}

/**
 * Item del carrito de pagos
 * 
 * Representa una cuota que se ha agregado al carrito para pago
 */
export interface ItemCarrito {
  /** Cuota agregada al carrito */
  cuota: Cuota;
  
  /** Si la cuota está seleccionada para pagar */
  seleccionada: boolean;
}
