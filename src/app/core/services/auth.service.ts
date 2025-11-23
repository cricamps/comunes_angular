import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { USUARIOS_MOCK, validarCredenciales } from '../../data/usuarios-mock';

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
   * Iniciar sesión
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
   * Cerrar sesión
   */
  logout(): void {
    this.currentUser = null;
    localStorage.removeItem(this.STORAGE_KEY);
    sessionStorage.removeItem(this.STORAGE_KEY);
    console.log('Sesión cerrada');
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser(): Usuario | null {
    // Si no hay usuario en memoria, intentar cargar de storage
    if (!this.currentUser) {
      this.cargarSesion();
    }
    return this.currentUser;
  }

  /**
   * Verificar si está autenticado
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
   * Verificar si es administrador
   */
  isAdmin(): boolean {
    return this.currentUser?.rol === 'administrador';
  }

  /**
   * Verificar si es residente
   */
  isResidente(): boolean {
    return this.currentUser?.rol === 'residente';
  }

  /**
   * Obtener nombre del usuario
   */
  getNombreUsuario(): string {
    return this.currentUser?.nombre || '';
  }

  /**
   * Obtener pasaje del usuario
   */
  getPasaje(): string {
    return this.currentUser?.pasaje || '';
  }

  /**
   * Obtener casa del usuario
   */
  getCasa(): string {
    return this.currentUser?.casa || '';
  }

  /**
   * Obtener identificación completa (Pasaje-Casa)
   */
  getUbicacion(): string {
    if (this.currentUser) {
      return `${this.currentUser.pasaje}-${this.currentUser.casa}`;
    }
    return '';
  }
}
