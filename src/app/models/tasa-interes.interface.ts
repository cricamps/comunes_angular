/**
 * Interfaz para tasa de interés (JSON externo GitHub Pages)
 */
export interface TasaInteres {
  id: number;
  entidad: string;
  tipoCredito: string;
  tasaAnual: number;
  plazoMeses: number;
  montoMinimo: number;
  vigente: boolean;
}
