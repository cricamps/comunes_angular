import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { AuthService } from '../../../core/services/auth.service';

interface Usuario {
  nombre: string;
  rut: string;
  email: string;
  telefono: string;
  pasaje?: string;
  casa?: string;
  rol: string;
  password: string;
  fechaRegistro?: string | Date;
}

interface Passwords {
  actual: string;
  nueva: string;
  confirmar: string;
}

interface Requisitos {
  longitud: boolean;
  mayuscula: boolean;
  minuscula: boolean;
  numero: boolean;
  especial: boolean;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  usuario: Usuario = {
    nombre: '',
    rut: '',
    email: '',
    telefono: '',
    rol: '',
    password: ''
  };

  usuarioOriginal: Usuario = { ...this.usuario };

  passwords: Passwords = {
    actual: '',
    nueva: '',
    confirmar: ''
  };

  // Visibilidad de contraseñas
  mostrarPasswordActual: boolean = false;
  mostrarPasswordNueva: boolean = false;
  mostrarPasswordConfirmar: boolean = false;

  // Requisitos de contraseña
  requisitos: Requisitos = {
    longitud: false,
    mayuscula: false,
    minuscula: false,
    numero: false,
    especial: false
  };

  passwordValida: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarUsuario();
  }

  cargarUsuario(): void {
    const usuarioActual = this.authService.getCurrentUser();
    if (usuarioActual) {
      this.usuario = { ...usuarioActual };
      this.usuarioOriginal = { ...usuarioActual };
    } else {
      this.router.navigate(['/login']);
    }
  }

  guardarPerfil(): void {
    if (!this.validarPerfil()) {
      return;
    }

    const usuarios = this.obtenerUsuarios();
    const index = usuarios.findIndex((u: any) => u.email === this.usuarioOriginal.email);

    if (index !== -1) {
      // Mantener la contraseña original
      usuarios[index] = {
        ...this.usuario,
        password: usuarios[index].password
      };

      this.guardarUsuarios(usuarios);
      
      // Actualizar sesión
      this.authService.logout();
      this.authService.login(this.usuario.email, usuarios[index].password, true);

      alert('✅ Perfil actualizado correctamente');
      this.usuarioOriginal = { ...this.usuario };
    }
  }

  cambiarPassword(): void {
    if (!this.validarCambioPassword()) {
      return;
    }

    const usuarios = this.obtenerUsuarios();
    const index = usuarios.findIndex((u: any) => u.email === this.usuario.email);

    if (index !== -1) {
      // Verificar contraseña actual
      if (usuarios[index].password !== this.passwords.actual) {
        alert('❌ La contraseña actual es incorrecta');
        return;
      }

      // Actualizar contraseña
      usuarios[index].password = this.passwords.nueva;
      this.guardarUsuarios(usuarios);

      // Actualizar sesión
      this.authService.logout();
      this.authService.login(this.usuario.email, this.passwords.nueva, true);

      alert('✅ Contraseña cambiada correctamente');
      
      // Limpiar formulario
      this.passwords = {
        actual: '',
        nueva: '',
        confirmar: ''
      };
      this.resetRequisitos();
    }
  }

  validarPerfil(): boolean {
    if (!this.usuario.nombre || this.usuario.nombre.length < 3) {
      alert('❌ El nombre debe tener al menos 3 caracteres');
      return false;
    }

    if (!this.usuario.email || !this.usuario.email.includes('@')) {
      alert('❌ Debe ingresar un email válido');
      return false;
    }

    if (!this.usuario.telefono || this.usuario.telefono.length !== 9) {
      alert('❌ El teléfono debe tener 9 dígitos');
      return false;
    }

    return true;
  }

  validarCambioPassword(): boolean {
    if (!this.passwords.actual) {
      alert('❌ Debe ingresar la contraseña actual');
      return false;
    }

    if (!this.passwords.nueva) {
      alert('❌ Debe ingresar la nueva contraseña');
      return false;
    }

    if (!this.passwordValida) {
      alert('❌ La nueva contraseña no cumple con los requisitos de seguridad');
      return false;
    }

    if (this.passwords.nueva !== this.passwords.confirmar) {
      alert('❌ Las contraseñas no coinciden');
      return false;
    }

    if (this.passwords.actual === this.passwords.nueva) {
      alert('❌ La nueva contraseña debe ser diferente a la actual');
      return false;
    }

    return true;
  }

  validarPassword(): void {
    const password = this.passwords.nueva;

    this.requisitos.longitud = password.length >= 8 && password.length <= 20;
    this.requisitos.mayuscula = /[A-Z]/.test(password);
    this.requisitos.minuscula = /[a-z]/.test(password);
    this.requisitos.numero = /[0-9]/.test(password);
    this.requisitos.especial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    this.passwordValida = Object.values(this.requisitos).every(req => req);
  }

  resetRequisitos(): void {
    this.requisitos = {
      longitud: false,
      mayuscula: false,
      minuscula: false,
      numero: false,
      especial: false
    };
    this.passwordValida = false;
  }

  cancelar(): void {
    this.usuario = { ...this.usuarioOriginal };
  }

  irAlDashboard(): void {
    if (this.usuario.rol === 'administrador') {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/usuario/dashboard']);
    }
  }

  eliminarCuenta(): void {
    const confirmacion = confirm(
      '¿Estás seguro de que deseas eliminar tu cuenta?\n\n' +
      'Esta acción no se puede deshacer. Se eliminarán todos tus datos permanentemente.'
    );

    if (!confirmacion) return;

    const usuarios = this.obtenerUsuarios();
    const usuariosFiltrados = usuarios.filter((u: any) => u.email !== this.usuario.email);

    this.guardarUsuarios(usuariosFiltrados);
    this.authService.logout();
    
    alert('✅ Tu cuenta ha sido eliminada');
    this.router.navigate(['/login']);
  }

  togglePasswordActual(): void {
    this.mostrarPasswordActual = !this.mostrarPasswordActual;
  }

  togglePasswordNueva(): void {
    this.mostrarPasswordNueva = !this.mostrarPasswordNueva;
  }

  togglePasswordConfirmar(): void {
    this.mostrarPasswordConfirmar = !this.mostrarPasswordConfirmar;
  }

  // Utilidades
  obtenerUsuarios(): any[] {
    const usuarios = localStorage.getItem('usuarios');
    return usuarios ? JSON.parse(usuarios) : [];
  }

  guardarUsuarios(usuarios: any[]): void {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }
}
