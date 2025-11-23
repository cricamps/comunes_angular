import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  // FORMULARIOS REACTIVOS
  loginForm!: FormGroup;
  solicitudForm!: FormGroup;
  
  // Variables de control
  mostrarPassword: boolean = false;
  errorMessage: string = '';
  mostrarError: boolean = false;
  cargando: boolean = false;

  // Casas disponibles por pasaje
  casasPorPasaje: { [key: string]: string[] } = {
    '8651': ['A', 'B', 'C', 'D', 'E', 'F'],
    '8707': ['A', 'B', 'C', 'D', 'E', 'F', 'G']
  };

  casasDisponibles: string[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.inicializarFormularios();
  }

  /**
   * Inicializar formularios reactivos
   */
  inicializarFormularios(): void {
    // FORMULARIO DE LOGIN
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(18)
      ]],
      rememberMe: [false]
    });

    // FORMULARIO DE SOLICITUD DE CUENTA
    this.solicitudForm = this.fb.group({
      nombre: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      rut: ['', [
        Validators.required,
        Validators.pattern(/^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      telefono: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{9}$/)
      ]],
      fechaNacimiento: ['', [
        Validators.required,
        this.validarEdadMinima(13)
      ]],
      pasaje: ['', Validators.required],
      casa: ['', Validators.required],
      direccion: [''], // OPCIONAL
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(18),
        this.validarPasswordFuerte()
      ]],
      confirmPassword: ['', Validators.required],
      mensaje: [''] // OPCIONAL
    }, {
      validators: this.validarPasswordsIguales('password', 'confirmPassword')
    });

    // Escuchar cambios en el pasaje
    this.solicitudForm.get('pasaje')?.valueChanges.subscribe(pasaje => {
      this.onPasajeChange(pasaje);
    });
  }

  /**
   * Validator personalizado: Edad mínima
   */
  validarEdadMinima(edadMinima: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const fechaNacimiento = new Date(control.value);
      const hoy = new Date();
      let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
      const mes = hoy.getMonth() - fechaNacimiento.getMonth();
      
      if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
        edad--;
      }

      return edad >= edadMinima ? null : { edadMinima: { requiredAge: edadMinima, actualAge: edad } };
    };
  }

  /**
   * Validator personalizado: Contraseña fuerte
   * Debe contener al menos 1 número y 1 mayúscula
   */
  validarPasswordFuerte() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const value = control.value;
      const tieneNumero = /[0-9]/.test(value);
      const tieneMayuscula = /[A-Z]/.test(value);

      const passwordValida = tieneNumero && tieneMayuscula;

      return passwordValida ? null : { 
        passwordDebil: { 
          tieneNumero, 
          tieneMayuscula 
        } 
      };
    };
  }

  /**
   * Validator personalizado: Contraseñas iguales
   */
  validarPasswordsIguales(passwordField: string, confirmPasswordField: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get(passwordField);
      const confirmPassword = formGroup.get(confirmPasswordField);

      if (!password || !confirmPassword) {
        return null;
      }

      if (confirmPassword.errors && !confirmPassword.errors['passwordsNoCoinciden']) {
        return null;
      }

      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ passwordsNoCoinciden: true });
        return { passwordsNoCoinciden: true };
      } else {
        confirmPassword.setErrors(null);
        return null;
      }
    };
  }

  /**
   * Alternar visibilidad de la contraseña
   */
  togglePassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  /**
   * Manejar envío del formulario de login
   */
  onLogin(): void {
    this.mostrarError = false;
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.mostrarError = true;
      this.errorMessage = 'Por favor complete todos los campos correctamente';
      this.loginForm.markAllAsTouched();
      return;
    }

    this.cargando = true;
    const { email, password, rememberMe } = this.loginForm.value;

    setTimeout(() => {
      if (this.authService.login(email, password, rememberMe)) {
        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/usuario/dashboard']);
        }
      } else {
        this.mostrarError = true;
        this.errorMessage = 'Correo electrónico o contraseña incorrectos';
        this.cargando = false;
      }
    }, 500);
  }

  /**
   * Limpiar formulario de login
   */
  limpiarLogin(): void {
    this.loginForm.reset();
    this.mostrarError = false;
    this.errorMessage = '';
  }

  /**
   * Manejar cambio de pasaje en el modal
   */
  onPasajeChange(pasaje: string): void {
    if (pasaje) {
      this.casasDisponibles = this.casasPorPasaje[pasaje] || [];
      this.solicitudForm.patchValue({ casa: '' });
    } else {
      this.casasDisponibles = [];
      this.solicitudForm.patchValue({ casa: '' });
    }
  }

  /**
   * Enviar solicitud de cuenta
   */
  enviarSolicitud(): void {
    if (this.solicitudForm.invalid) {
      this.solicitudForm.markAllAsTouched();
      alert('❌ Por favor complete todos los campos obligatorios correctamente');
      return;
    }

    const solicitudes = this.obtenerSolicitudes();
    const formValues = this.solicitudForm.value;
    
    const nuevaSolicitud = {
      id: 'sol_' + Date.now(),
      nombre: formValues.nombre,
      rut: formValues.rut,
      email: formValues.email,
      telefono: formValues.telefono,
      fechaNacimiento: formValues.fechaNacimiento,
      pasaje: formValues.pasaje,
      casa: formValues.casa,
      direccion: formValues.direccion || '',
      mensaje: formValues.mensaje || '',
      fecha: new Date().toISOString(),
      estado: 'pendiente'
    };

    solicitudes.push(nuevaSolicitud);
    localStorage.setItem('solicitudes', JSON.stringify(solicitudes));
    
    alert('✅ ¡Solicitud enviada correctamente!\n\nUn administrador revisará tu solicitud y se pondrá en contacto contigo.');
    
    this.limpiarSolicitud();
  }

  /**
   * Limpiar formulario de solicitud
   */
  limpiarSolicitud(): void {
    this.solicitudForm.reset();
    this.casasDisponibles = [];
  }

  /**
   * Obtener solicitudes de localStorage
   */
  private obtenerSolicitudes(): any[] {
    const solicitudes = localStorage.getItem('solicitudes');
    return solicitudes ? JSON.parse(solicitudes) : [];
  }

  /**
   * Formatear RUT mientras se escribe
   */
  formatearRUT(event: any): void {
    let valor = event.target.value.replace(/\./g, '').replace(/-/g, '');
    
    if (valor.length > 1) {
      const cuerpo = valor.slice(0, -1);
      const dv = valor.slice(-1);
      const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      
      this.solicitudForm.patchValue({ 
        rut: `${cuerpoFormateado}-${dv}` 
      }, { emitEvent: false });
    }
  }

  /**
   * Helper: Verificar si un campo tiene error
   */
  tieneError(formName: 'login' | 'solicitud', fieldName: string, errorType?: string): boolean {
    const form = formName === 'login' ? this.loginForm : this.solicitudForm;
    const field = form.get(fieldName);
    
    if (!field) return false;
    
    if (errorType) {
      return !!(field.touched && field.errors?.[errorType]);
    }
    
    return !!(field.touched && field.invalid);
  }

  /**
   * Helper: Obtener mensaje de error
   */
  obtenerMensajeError(formName: 'login' | 'solicitud', fieldName: string): string {
    const form = formName === 'login' ? this.loginForm : this.solicitudForm;
    const field = form.get(fieldName);
    
    if (!field || !field.errors) return '';
    
    const errors = field.errors;
    
    if (errors['required']) return 'Este campo es obligatorio';
    if (errors['email']) return 'Ingrese un email válido';
    if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    if (errors['maxlength']) return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
    if (errors['pattern']) {
      if (fieldName === 'telefono') return 'Debe tener 9 dígitos';
      if (fieldName === 'rut') return 'Formato: 12.345.678-9';
      return 'Formato inválido';
    }
    if (errors['edadMinima']) return `Debes tener al menos ${errors['edadMinima'].requiredAge} años`;
    if (errors['passwordDebil']) {
      const { tieneNumero, tieneMayuscula } = errors['passwordDebil'];
      if (!tieneNumero && !tieneMayuscula) return 'Debe contener al menos 1 número y 1 mayúscula';
      if (!tieneNumero) return 'Debe contener al menos 1 número';
      if (!tieneMayuscula) return 'Debe contener al menos 1 mayúscula';
    }
    if (errors['passwordsNoCoinciden']) return 'Las contraseñas no coinciden';
    
    return 'Campo inválido';
  }
}
