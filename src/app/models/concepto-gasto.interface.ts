/**
 * Tipo de cálculo para un concepto de gasto
 */
export type TipoCalculo = 'fijo' | 'proporcional' | 'variable';

/**
 * Categoría de un concepto de gasto
 */
export type CategoriaGasto = 
  | 'servicios-basicos' 
  | 'mantenimiento' 
  | 'seguros' 
  | 'administracion' 
  | 'servicios-adicionales';

/**
 * Interfaz que representa un concepto de gasto común
 */
export interface ConceptoGasto {
  id: number;
  nombre: string;
  descripcion: string;
  tipoCalculo: TipoCalculo;
  montoPorDefecto: number;
  activo: boolean;
  categoria: CategoriaGasto;
}
