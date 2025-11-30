import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { USUARIOS_MOCK, validarCredenciales } from '../../data/usuarios-mock';

/**
 * Servicio de autenticación
 * 
 * Maneja el inicio de sesión, cierre de sesión y gestión de la sesión del usuario.
 * Utiliza localStorage para sesiones persistentes y sessionStorage para sesiones temporales.
 * 
 * @example
 * ```typescript
 * constructor(private authService: AuthService) {}
 * 
 * login() {
 *   if (this.authService.login('admin@comunes.cl', 'Admin123!', true)) {
 *     this.router.navigate(['/admin/dashboard']);
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: Usuario | null = null;
  private readonly STORAGE_KEY = 'sesionActual';

  constructor() {
    this.cargarSesion();
  }

  /**
   * Cargar sesión desde localStorage o sessionStorage
   * 
   * Intenta cargar la sesión primero desde localStorage (sesión persistente),
   * y si no existe, desde sessionStorage (sesión temporal).
   * 
   * @private
   * @returns {void}
   */
  private cargarSesion(): void {
    // Intentar cargar desde localStorage primero
    let sesionGuardada = localStorage.getItem(this.STORAGE_KEY);
    
    // Si no está en localStorage, intentar sessionStorage
    if (!sesionGuardada) {
      sesionGuardada = sessionStorage.getItem(this.STORAGE_KEY);
    }
    
    if (sesionGuardada) {
      try {
        this.currentUser = JSON.parse(sesionGuardada);
        console.log('Sesión cargada:', this.currentUser?.email);
      } catch (error) {
        console.error('Error al cargar sesión:', error);
        this.logout();
      }
    }
  }

  /**
   * Iniciar sesión en el sistema
   * 
   * Valida las credenciales del usuario y crea una sesión activa.
   * Si recordar es true, la sesión se guarda en localStorage (persistente).
   * Si es false, se guarda en sessionStorage (se borra al cerrar el navegador).
   * 
   * @param {string} email - Correo electrónico del usuario
   * @param {string} password - Contraseña del usuario
   * @param {boolean} recordar - Si se debe recordar la sesión (por defecto false)
   * @returns {boolean} True si el login fue exitoso, false en caso contrario
   * 
   * @example
   * ```typescript
   * const exito = this.authService.login('admin@comunes.cl', 'Admin123!', true);
   * if (exito) {
   *   console.log('Login exitoso');
   * }
   * ```
   */
  login(email: string, password: string, recordar: boolean = false): boolean {
    const usuario = validarCredenciales(email, password);
    
    if (usuario) {
      this.currentUser = usuario;
      
      // Guardar sesión según preferencia
      const datosUsuario = JSON.stringify(usuario);
      
      if (recordar) {
        localStorage.setItem(this.STORAGE_KEY, datosUsuario);
        sessionStorage.removeItem(this.STORAGE_KEY); // Limpiar sessionStorage
      } else {
        sessionStorage.setItem(this.STORAGE_KEY, datosUsuario);
        localStorage.removeItem(this.STORAGE_KEY); // Limpiar localStorage
      }
      
      console.log('Login exitoso:', usuario.email, 'Recordar:', recordar);
      return true;
    }
    
    console.log('Login fallido para:', email);
    return false;
  }

  /**
   * Cerrar sesión del usuario actual
   * 
   * Elimina los datos de sesión de localStorage y sessionStorage,
   * y limpia el usuario actual en memoria.
   * 
   * @returns {void}
   * 
   * @example
   * ```typescript
   * this.authService.logout();
   * this.router.navigate(['/login']);
   * ```
   */
  logout(): void {
    this.currentUser = null;
    localStorage.removeItem(this.STORAGE_KEY);
    sessionStorage.removeItem(this.STORAGE_KEY);
    console.log('Sesión cerrada');
  }

  /**
   * Obtener el usuario actualmente autenticado
   * 
   * Si no hay usuario en memoria, intenta cargarlo desde el storage.
   * 
   * @returns {Usuario | null} El usuario actual o null si no hay sesión activa
   * 
   * @example
   * ```typescript
   * const usuario = this.authService.getCurrentUser();
   * if (usuario) {
   *   console.log('Usuario:', usuario.nombre);
   * }
   * ```
   */
  getCurrentUser(): Usuario | null {
    // Si no hay usuario en memoria, intentar cargar de storage
    if (!this.currentUser) {
      this.cargarSesion();
    }
    return this.currentUser;
  }

  /**
   * Verificar si hay un usuario autenticado
   * 
   * Comprueba si existe una sesión activa. Si no hay usuario en memoria,
   * intenta cargarlo del storage antes de responder.
   * 
   * @returns {boolean} True si hay un usuario autenticado, false en caso contrario
   * 
   * @example
   * ```typescript
   * if (this.authService.isAuthenticated()) {
   *   // Usuario autenticado
   * } else {
   *   this.router.navigate(['/login']);
   * }
   * ```
   */
  isAuthenticated(): boolean {
    // Si no hay usuario en memoria, intentar cargar
    if (!this.currentUser) {
      this.cargarSesion();
    }
    
    const autenticado = this.currentUser !== null;
    console.log('isAuthenticated:', autenticado, 'Usuario:', this.currentUser?.email);
    return autenticado;
  }

  /**
   * Verificar si el usuario actual es administrador
   * 
   * @returns {boolean} True si el usuario tiene rol de administrador
   * 
   * @example
   * ```typescript
   * if (this.authService.isAdmin()) {
   *   // Mostrar opciones de administrador
   * }
   * ```
   */
  isAdmin(): boolean {
    return this.currentUser?.rol === 'administrador';
  }

  /**
   * Verificar si el usuario actual es residente
   * 
   * @returns {boolean} True si el usuario tiene rol de residente
   */
  isResidente(): boolean {
    return this.currentUser?.rol === 'residente';
  }

  /**
   * Obtener el nombre completo del usuario actual
   * 
   * @returns {string} Nombre del usuario o cadena vacía si no hay sesión
   */
  getNombreUsuario(): string {
    return this.currentUser?.nombre || '';
  }

  /**
   * Obtener el número de pasaje del usuario actual
   * 
   * @returns {string} Número del pasaje (8651 o 8707) o cadena vacía
   */
  getPasaje(): string {
    return this.currentUser?.pasaje || '';
  }

  /**
   * Obtener la letra de casa del usuario actual
   * 
   * @returns {string} Letra de la casa (A-G) o cadena vacía
   */
  getCasa(): string {
    return this.currentUser?.casa || '';
  }

  /**
   * Obtener la ubicación completa del usuario
   * 
   * Retorna la identificación en formato "Pasaje-Casa" (ej: "8651-A")
   * 
   * @returns {string} Ubicación en formato "Pasaje-Casa" o cadena vacía
   * 
   * @example
   * ```typescript
   * const ubicacion = this.authService.getUbicacion(); // "8651-A"
   * ```
   */
  getUbicacion(): string {
    if (this.currentUser) {
      return `${this.currentUser.pasaje}-${this.currentUser.casa}`;
    }
    return '';
  }

  /**
   * Registrar un nuevo usuario en el sistema
   * 
   * Este método valida que no exista un correo duplicado antes de agregar el usuario.
   * La validación es crítica para mantener la integridad de la base de datos.
   * 
   * @param {Usuario} usuario - Objeto que contiene los datos del nuevo usuario:
   * nombre, email, password, rut, telefono, pasaje, casa, rol, tipo y fechaRegistro
   * 
   * @returns {boolean} Retorna true si el registro fue exitoso,
   * y retorna false si el correo ya existe en la base de datos
   * 
   * @example
   * ```typescript
   * const resultado = authService.addUser({
   *   nombre: 'Juan',
   *   email: 'juan@correo.com',
   *   password: 'Contra123',
   *   rut: '12345678-9',
   *   telefono: '912345678',
   *   pasaje: '8651',
   *   casa: 'D',
   *   rol: 'residente',
   *   tipo: 'residente',
   *   fechaRegistro: new Date()
   * });
   * ```
   * 
   * @usageNotes
   * Este método almacena los usuarios en localStorage.
   * Es necesario asegurarse de que localStorage tenga el formato correcto.
   * Este método es usado por RegisterComponent y AdminComponent.
   */
  addUser(usuario: Usuario): boolean {
    // Validar que no exista el correo
    const usuarios = this.obtenerTodosLosUsuarios();
    const emailExiste = usuarios.some(u => u.email === usuario.email);
    
    if (emailExiste) {
      console.log('Error: El correo ya está registrado:', usuario.email);
      return false;
    }
    
    // Agregar usuario al array
    usuarios.push(usuario);
    
    // Guardar en localStorage
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    console.log('Usuario registrado exitosamente:', usuario.email);
    
    return true;
  }

  /**
   * Obtener todos los usuarios del sistema
   * 
   * Lee los usuarios desde localStorage o retorna los usuarios mock
   * si no hay datos guardados.
   * 
   * @private
   * @returns {Usuario[]} Array con todos los usuarios registrados
   */
  private obtenerTodosLosUsuarios(): Usuario[] {
    const usuariosStorage = localStorage.getItem('usuarios');
    if (usuariosStorage) {
      return JSON.parse(usuariosStorage);
    }
    return [...USUARIOS_MOCK];
  }
}
