import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CustomValidators } from '../../../shared/validators/custom-validators';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent implements OnInit {
  registroForm!: FormGroup;
  mostrarPassword: boolean = false;
  mostrarConfirmPassword: boolean = false;
  formularioEnviado: boolean = false;

  // Casas disponibles por pasaje
  casasPorPasaje: { [key: string]: string[] } = {
    '8651': ['A', 'B', 'C', 'D', 'E', 'F'],
    '8707': ['A', 'B', 'C', 'D', 'E', 'F', 'G']
  };

  casasDisponibles: string[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  /**
   * Inicializar el formulario reactivo con todas las validaciones
   */
  inicializarFormulario(): void {
    this.registroForm = this.fb.group({
      // DATOS PERSONALES
      nombre: ['', [
        Validators.required,
        Validators.minLength(3),
        CustomValidators.noWhitespace()
      ]],
      
      rut: ['', [
        Validators.required,
        CustomValidators.rutValidator()
      ]],
      
      email: ['', [
        Validators.required,
        Validators.email,
        CustomValidators.emailStrict()
      ]],
      
      telefono: ['', [
        Validators.required,
        CustomValidators.telefonoChileno()
      ]],
      
      fechaNacimiento: ['', [
        Validators.required,
        CustomValidators.minAge(13)
      ]],

      // UBICACIÓN
      pasaje: ['', Validators.required],
      
      casa: ['', Validators.required],
      
      direccionDespacho: [''], // OPCIONAL - No tiene validaciones requeridas

      // CONTRASEÑAS
      password: ['', [
        Validators.required,
        CustomValidators.passwordLength(6, 18),
        CustomValidators.passwordStrength()
      ]],
      
      confirmPassword: ['', Validators.required]
    }, {
      // Validador a nivel de formulario (para comparar contraseñas)
      validators: CustomValidators.passwordsMatch('password', 'confirmPassword')
    });

    // Suscribirse a cambios del pasaje para actualizar casas disponibles
    this.registroForm.get('pasaje')?.valueChanges.subscribe(pasaje => {
      this.onPasajeChange(pasaje);
    });
  }

  /**
   * Manejar cambio de pasaje
   */
  onPasajeChange(pasaje: string): void {
    if (pasaje) {
      this.casasDisponibles = this.casasPorPasaje[pasaje] || [];
      
      // Limpiar casa seleccionada si cambió el pasaje
      this.registroForm.patchValue({ casa: '' });
    } else {
      this.casasDisponibles = [];
    }
  }

  /**
   * Alternar visibilidad de contraseña
   */
  togglePassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  /**
   * Alternar visibilidad de confirmación de contraseña
   */
  toggleConfirmPassword(): void {
    this.mostrarConfirmPassword = !this.mostrarConfirmPassword;
  }

  /**
   * Enviar formulario
   */
  onSubmit(): void {
    this.formularioEnviado = true;

    // Marcar todos los campos como touched para mostrar errores
    this.marcarTodosTocados();

    if (this.registroForm.valid) {
      console.log('✅ Formulario válido!');
      console.log('Datos:', this.registroForm.value);

      // Aquí iría la lógica para guardar el usuario
      // Por ahora solo mostramos un alert
      alert('¡Registro exitoso!\n\nTus datos han sido guardados correctamente.');
      
      // Redirigir al login
      this.router.navigate(['/login']);
    } else {
      console.log('❌ Formulario inválido');
      console.log('Errores:', this.obtenerErroresFormulario());
      
      // Scroll al primer error
      this.scrollAPrimerError();
    }
  }

  /**
   * Limpiar formulario
   */
  limpiarFormulario(): void {
    this.registroForm.reset();
    this.formularioEnviado = false;
    this.casasDisponibles = [];
    this.mostrarPassword = false;
    this.mostrarConfirmPassword = false;
  }

  /**
   * Verificar si un campo tiene error
   */
  tieneError(campo: string): boolean {
    const control = this.registroForm.get(campo);
    return !!(control && control.invalid && (control.dirty || control.touched || this.formularioEnviado));
  }

  /**
   * Obtener mensaje de error para un campo
   */
  obtenerMensajeError(campo: string): string {
    const control = this.registroForm.get(campo);
    
    if (!control || !control.errors) {
      return '';
    }

    const errors = control.errors;

    // ERRORES GENERALES
    if (errors['required']) {
      return 'Este campo es obligatorio';
    }

    if (errors['whitespace']) {
      return 'No puede contener solo espacios en blanco';
    }

    // ERRORES ESPECÍFICOS POR CAMPO
    switch (campo) {
      case 'nombre':
        if (errors['minlength']) {
          return `Debe tener al menos ${errors['minlength'].requiredLength} caracteres`;
        }
        break;

      case 'rut':
        if (errors['rutInvalido']) {
          return 'RUT inválido';
        }
        break;

      case 'email':
        if (errors['email'] || errors['emailInvalido']) {
          return 'Correo electrónico inválido';
        }
        break;

      case 'telefono':
        if (errors['telefonoInvalido']) {
          return 'Teléfono inválido (debe comenzar con 9 y tener 9 dígitos)';
        }
        break;

      case 'fechaNacimiento':
        if (errors['minAge']) {
          return `Debes tener al menos ${errors['minAge'].minAge} años`;
        }
        break;

      case 'password':
        if (errors['passwordLength']) {
          return errors['passwordLength'].message;
        }
        if (errors['passwordStrength']) {
          const { hasUpperCase, hasNumber } = errors['passwordStrength'];
          const mensajes = [];
          if (!hasUpperCase) mensajes.push('una mayúscula');
          if (!hasNumber) mensajes.push('un número');
          return `Debe contener al menos ${mensajes.join(' y ')}`;
        }
        break;

      case 'confirmPassword':
        if (errors['passwordMismatch']) {
          return 'Las contraseñas no coinciden';
        }
        break;
    }

    return 'Campo inválido';
  }

  /**
   * Obtener clase CSS para el campo (válido/inválido)
   */
  obtenerClaseCampo(campo: string): string {
    const control = this.registroForm.get(campo);
    
    if (!control || (!control.dirty && !control.touched && !this.formularioEnviado)) {
      return '';
    }

    return control.valid ? 'is-valid' : 'is-invalid';
  }

  /**
   * Formatear RUT mientras se escribe
   */
  formatearRUT(event: any): void {
    let valor = event.target.value.replace(/\./g, '').replace(/-/g, '');
    
    if (valor.length > 1) {
      const cuerpo = valor.slice(0, -1);
      const dv = valor.slice(-1);
      
      // Formatear con puntos
      const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      
      this.registroForm.patchValue({ rut: `${cuerpoFormateado}-${dv}` });
    }
  }

  /**
   * Marcar todos los campos como touched
   */
  private marcarTodosTocados(): void {
    Object.keys(this.registroForm.controls).forEach(key => {
      const control = this.registroForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Obtener todos los errores del formulario
   */
  private obtenerErroresFormulario(): any {
    const errores: any = {};
    
    Object.keys(this.registroForm.controls).forEach(key => {
      const control = this.registroForm.get(key);
      if (control && control.errors) {
        errores[key] = control.errors;
      }
    });

    return errores;
  }

  /**
   * Scroll al primer campo con error
   */
  private scrollAPrimerError(): void {
    setTimeout(() => {
      const primerError = document.querySelector('.is-invalid');
      if (primerError) {
        primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }

  /**
   * Getter para acceso rápido a los controles del formulario
   */
  get f() {
    return this.registroForm.controls;
  }

  /**
   * Verificar si la contraseña tiene mayúscula
   */
  tienePasswordMayuscula(): boolean {
    const password = this.f['password'].value;
    if (!password) return false;
    return /[A-Z]/.test(password);
  }

  /**
   * Verificar si la contraseña tiene número
   */
  tienePasswordNumero(): boolean {
    const password = this.f['password'].value;
    if (!password) return false;
    return /[0-9]/.test(password);
  }

  /**
   * Verificar si la contraseña tiene longitud válida
   */
  tienePasswordLongitudValida(): boolean {
    const password = this.f['password'].value;
    if (!password) return false;
    return password.length >= 6 && password.length <= 18;
  }
}
