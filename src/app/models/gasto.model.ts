export interface Gasto {
  id: number;
  concepto: string;
  categoria: 'Jardinería' | 'Servicios Básicos' | 'Seguridad' | 'Limpieza' | 'Mantenimiento' | 'Otros';
  monto: number;
  fecha: Date;
  descripcion: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  fechaCreacion: Date;
}
