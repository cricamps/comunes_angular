import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validadores personalizados para la aplicación Gastos Comunes
 * Semana 5 - Desarrollo Full Stack II
 */

export class CustomValidators {

  /**
   * Validador: Las dos contraseñas deben ser iguales
   * Uso: aplicar al FormGroup completo
   */
  static passwordsMatch(passwordField: string, confirmPasswordField: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get(passwordField);
      const confirmPassword = formGroup.get(confirmPasswordField);

      if (!password || !confirmPassword) {
        return null;
      }

      if (confirmPassword.errors && !confirmPassword.errors['passwordMismatch']) {
        return null;
      }

      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        confirmPassword.setErrors(null);
        return null;
      }
    };
  }

  /**
   * Validador: La contraseña debe contener al menos un número y una letra mayúscula
   * Uso: aplicar al control de contraseña
   */
  static passwordStrength(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      // Verificar que tenga al menos una mayúscula
      const hasUpperCase = /[A-Z]/.test(value);

      // Verificar que tenga al menos un número
      const hasNumber = /[0-9]/.test(value);

      const passwordValid = hasUpperCase && hasNumber;

      return passwordValid ? null : { 
        passwordStrength: {
          hasUpperCase,
          hasNumber
        }
      };
    };
  }

  /**
   * Validador: Edad mínima de 13 años
   * Uso: aplicar al control de fecha de nacimiento
   */
  static minAge(minAge: number = 13): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const birthDate = new Date(control.value);
      const today = new Date();
      
      // Calcular la edad
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      // Ajustar si aún no ha cumplido años este año
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      return age >= minAge ? null : { 
        minAge: {
          minAge,
          actualAge: age
        }
      };
    };
  }

  /**
   * Validador: Longitud de contraseña entre 6 y 18 caracteres
   * Uso: aplicar al control de contraseña
   */
  static passwordLength(min: number = 6, max: number = 18): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const length = value.length;

      if (length < min) {
        return { 
          passwordLength: {
            min,
            max,
            actual: length,
            message: `La contraseña debe tener al menos ${min} caracteres`
          }
        };
      }

      if (length > max) {
        return { 
          passwordLength: {
            min,
            max,
            actual: length,
            message: `La contraseña no puede tener más de ${max} caracteres`
          }
        };
      }

      return null;
    };
  }

  /**
   * Validador: RUT chileno válido
   * Uso: aplicar al control de RUT
   */
  static rutValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      // Limpiar el RUT (quitar puntos y guión)
      const rutLimpio = value.replace(/\./g, '').replace(/-/g, '');

      // Verificar formato básico (7-8 dígitos + 1 dígito verificador)
      if (!/^\d{7,8}[0-9Kk]$/.test(rutLimpio)) {
        return { rutInvalido: true };
      }

      // Separar número y dígito verificador
      const rutNumero = rutLimpio.slice(0, -1);
      const dvIngresado = rutLimpio.slice(-1).toUpperCase();

      // Calcular dígito verificador
      let suma = 0;
      let multiplicador = 2;

      for (let i = rutNumero.length - 1; i >= 0; i--) {
        suma += parseInt(rutNumero.charAt(i)) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
      }

      const dvCalculado = 11 - (suma % 11);
      let dvEsperado: string;

      if (dvCalculado === 11) {
        dvEsperado = '0';
      } else if (dvCalculado === 10) {
        dvEsperado = 'K';
      } else {
        dvEsperado = dvCalculado.toString();
      }

      return dvIngresado === dvEsperado ? null : { rutInvalido: true };
    };
  }

  /**
   * Validador: Teléfono chileno válido (+56 9 XXXX XXXX)
   * Uso: aplicar al control de teléfono
   */
  static telefonoChileno(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      // Formato: 9 dígitos, comenzando con 9
      const telefonoRegex = /^9\d{8}$/;

      return telefonoRegex.test(value) ? null : { telefonoInvalido: true };
    };
  }

  /**
   * Validador: Email válido (más estricto que el validator por defecto)
   * Uso: aplicar al control de email
   */
  static emailStrict(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      // Regex más estricto para email
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      return emailRegex.test(value) ? null : { emailInvalido: true };
    };
  }

  /**
   * Validador: Campo no puede contener solo espacios en blanco
   * Uso: aplicar a cualquier control de texto
   */
  static noWhitespace(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const isWhitespace = (value || '').trim().length === 0;
      
      return isWhitespace ? { whitespace: true } : null;
    };
  }

  /**
   * Validador: Casa debe estar en el rango correcto según el pasaje
   * Uso: aplicar al control de casa
   */
  static casaValida(pasajeControl: AbstractControl): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const casa = control.value;
      const pasaje = pasajeControl.value;

      if (!casa || !pasaje) {
        return null;
      }

      const casasPorPasaje: { [key: string]: string[] } = {
        '8651': ['A', 'B', 'C', 'D', 'E', 'F'],
        '8707': ['A', 'B', 'C', 'D', 'E', 'F', 'G']
      };

      const casasValidas = casasPorPasaje[pasaje] || [];

      return casasValidas.includes(casa) ? null : { casaInvalida: true };
    };
  }
}
