/**
 * Interfaz de Usuario del Sistema
 * 
 * Representa un usuario del sistema de gastos comunes con sus datos personales
 * y de vivienda. Puede ser de tipo 'administrador' o 'residente', cada uno con
 * permisos y funcionalidades diferentes.
 * 
 * @example
 * ```typescript
 * const usuario: Usuario = {
 *   email: 'admin@comunes.cl',
 *   password: 'Admin123!',
 *   nombre: 'Administrador Principal',
 *   rut: '12345678-9',
 *   telefono: '987654321',
 *   pasaje: '8651',
 *   casa: 'A',
 *   rol: 'administrador',
 *   tipo: 'administrador',
 *   fechaRegistro: new Date()
 * };
 * ```
 */
export interface Usuario {
  /** Correo electrónico único del usuario (usado para login) */
  email: string;
  
  /** Contraseña del usuario (en producción debe estar hasheada) */
  password: string;
  
  /** Nombre completo del usuario */
  nombre: string;
  
  /** RUT chileno con formato 12.345.678-9 */
  rut: string;
  
  /** Teléfono de contacto (9 dígitos sin código de país) */
  telefono: string;
  
  /** Número del pasaje donde reside (8651 con 6 casas o 8707 con 7 casas) */
  pasaje: '8651' | '8707';
  
  /** Letra de la casa (A-F para pasaje 8651, A-G para pasaje 8707) */
  casa: string;
  
  /** Rol del usuario que determina sus permisos en el sistema */
  rol: 'administrador' | 'residente';
  
  /** Tipo de usuario (igual a rol, mantenido por compatibilidad) */
  tipo: 'administrador' | 'residente';
  
  /** Fecha de registro del usuario en el sistema */
  fechaRegistro: Date;
}
