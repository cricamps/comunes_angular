export interface Pago {
  id: number;
  email: string;
  pasaje: string;
  casa: string;
  monto: number;
  mes: string;  // formato: 'YYYY-MM'
  fechaPago: Date;
  metodoPago: 'transferencia' | 'efectivo' | 'debito' | 'credito';
  comprobante: string;
  estado: 'pendiente' | 'confirmado' | 'rechazado';
  registradoPor: string;
}
