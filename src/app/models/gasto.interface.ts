export interface Gasto {
  id?: number;
  concepto: string;
  descripcion: string;
  monto: number;
  fecha: string;
  estado: string;
  categoria?: string;
}
