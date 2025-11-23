import { Usuario } from '../models/usuario.model';

export const USUARIOS_MOCK: Usuario[] = [
  {
    // ADMINISTRADOR
    email: 'admin@comunes.cl',
    password: 'Admin123!',
    nombre: 'Administrador Principal',
    rut: '12345678-9',
    telefono: '987654321',
    pasaje: '8651',
    casa: 'A',
    rol: 'administrador',
    tipo: 'administrador',
    fechaRegistro: new Date('2024-01-01')
  },
  {
    // RESIDENTE 1
    email: 'usuario@comunes.cl',
    password: 'User123!',
    nombre: 'Juan Pérez Soto',
    rut: '98765432-1',
    telefono: '912345678',
    pasaje: '8651',
    casa: 'B',
    rol: 'residente',
    tipo: 'residente',
    fechaRegistro: new Date('2024-01-15')
  },
  {
    // RESIDENTE 2
    email: 'maria@comunes.cl',
    password: 'Maria123!',
    nombre: 'María González López',
    rut: '11222333-4',
    telefono: '923456789',
    pasaje: '8651',
    casa: 'C',
    rol: 'residente',
    tipo: 'residente',
    fechaRegistro: new Date('2024-02-01')
  },
  {
    // RESIDENTE 3
    email: 'pedro@comunes.cl',
    password: 'Pedro123!',
    nombre: 'Pedro Ramírez Castro',
    rut: '22333444-5',
    telefono: '934567890',
    pasaje: '8707',
    casa: 'A',
    rol: 'residente',
    tipo: 'residente',
    fechaRegistro: new Date('2024-02-15')
  },
  {
    // RESIDENTE 4
    email: 'ana@comunes.cl',
    password: 'Ana123!',
    nombre: 'Ana Martínez Silva',
    rut: '33444555-6',
    telefono: '945678901',
    pasaje: '8707',
    casa: 'B',
    rol: 'residente',
    tipo: 'residente',
    fechaRegistro: new Date('2024-03-01')
  }
];

// Funciones helper
export function obtenerUsuarioPorEmail(email: string): Usuario | undefined {
  return USUARIOS_MOCK.find(u => u.email === email);
}

export function obtenerUsuariosPorPasaje(pasaje: string): Usuario[] {
  return USUARIOS_MOCK.filter(u => u.pasaje === pasaje);
}

export function obtenerUsuariosPorRol(rol: 'administrador' | 'residente'): Usuario[] {
  return USUARIOS_MOCK.filter(u => u.rol === rol);
}

export function validarCredenciales(email: string, password: string): Usuario | null {
  const usuario = USUARIOS_MOCK.find(u => u.email === email && u.password === password);
  return usuario || null;
}
