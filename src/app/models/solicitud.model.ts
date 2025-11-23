export interface Solicitud {
  id: number;
  nombre: string;
  rut: string;
  email: string;
  telefono: string;
  pasaje: '8651' | '8707';
  casa: string;
  mensaje?: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  fechaSolicitud: Date;
  fechaRespuesta?: Date;
  respondidoPor?: string;
}
