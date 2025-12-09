/**
 * Interfaz para tipo de cambio (API externa real)
 */
export interface TipoCambio {
  date: string;
  base: string;
  rates: {
    CLP: number;
    EUR: number;
    GBP: number;
    JPY: number;
    [key: string]: number;
  };
}

/**
 * Interfaz simplificada para mostrar en el componente
 */
export interface TipoCambioSimple {
  moneda: string;
  valor: number;
  fecha: string;
}
