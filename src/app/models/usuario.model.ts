export interface Usuario {
  email: string;
  password: string;
  nombre: string;
  rut: string;
  telefono: string;
  pasaje: '8651' | '8707';
  casa: string;  // A, B, C, D, E, F, G
  rol: 'administrador' | 'residente';
  tipo: 'administrador' | 'residente';  // mismo que rol, para compatibilidad
  fechaRegistro: Date;
}
