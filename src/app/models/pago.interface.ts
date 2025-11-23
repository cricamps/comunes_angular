export interface Pago {
  id?: number;
  nombreResidente?: string;
  email?: string;
  pasaje: string;
  casa: string;
  monto: number;
  fecha: string;
  estado?: string;
  metodoPago?: string;
}
