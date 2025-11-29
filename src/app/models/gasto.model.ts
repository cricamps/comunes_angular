/**
 * Interfaz de Gasto Común
 * 
 * Representa un gasto compartido entre todos los residentes de la comunidad.
 * Los gastos se dividen equitativamente entre las 13 casas (6 del pasaje 8651 + 7 del pasaje 8707).
 * 
 * @example
 * ```typescript
 * const gasto: Gasto = {
 *   id: 1,
 *   concepto: 'Mantención de Áreas Verdes',
 *   categoria: 'Jardinería',
 *   monto: 65000,
 *   fecha: new Date('2025-11-01'),
 *   descripcion: 'Poda y mantención mensual de jardines comunes',
 *   estado: 'aprobado',
 *   fechaCreacion: new Date('2025-10-25')
 * };
 * // Monto por casa: 65000 / 13 = 5000
 * ```
 */
export interface Gasto {
  /** Identificador único del gasto */
  id: number;
  
  /** Nombre o concepto del gasto */
  concepto: string;
  
  /** Categoría a la que pertenece el gasto */
  categoria: 'Jardinería' | 'Servicios Básicos' | 'Seguridad' | 'Limpieza' | 'Mantenimiento' | 'Otros';
  
  /** Monto total del gasto en pesos chilenos */
  monto: number;
  
  /** Fecha en que se realizó o se aplicará el gasto */
  fecha: Date;
  
  /** Descripción detallada del gasto */
  descripcion: string;
  
  /** Estado de aprobación del gasto */
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  
  /** Fecha en que se creó el registro del gasto en el sistema */
  fechaCreacion: Date;
}
