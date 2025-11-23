import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';

describe('LoginComponent - Semana 5', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'isAdmin']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule
      ],
      providers: [
        provideRouter([]), // Proveedor de router vacío para tests
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ============================================
  // PRUEBAS UNITARIAS - VALIDACIONES DE LOGIN
  // ============================================

  describe('Validaciones de Login', () => {
    it('1. debe validar email inválido', () => {
      const emailControl = component.loginForm.get('email');
      
      emailControl?.setValue('correo-invalido');
      
      expect(emailControl?.errors?.['email']).toBeTruthy();
      expect(emailControl?.valid).toBeFalse();
    });

    it('2. debe aceptar email válido', () => {
      const emailControl = component.loginForm.get('email');
      
      emailControl?.setValue('test@test.com');
      
      expect(emailControl?.errors).toBeNull();
      expect(emailControl?.valid).toBeTrue();
    });

    it('3. debe validar contraseña con longitud mínima', () => {
      const passwordControl = component.loginForm.get('password');
      
      passwordControl?.setValue('12345'); // 5 caracteres (menos de 6)
      
      expect(passwordControl?.errors?.['minlength']).toBeTruthy();
      expect(passwordControl?.valid).toBeFalse();
    });

    it('4. debe validar contraseña con longitud máxima', () => {
      const passwordControl = component.loginForm.get('password');
      
      passwordControl?.setValue('1234567890123456789'); // 19 caracteres (más de 18)
      
      expect(passwordControl?.errors?.['maxlength']).toBeTruthy();
      expect(passwordControl?.valid).toBeFalse();
    });

    it('5. debe aceptar contraseña con longitud válida', () => {
      const passwordControl = component.loginForm.get('password');
      
      passwordControl?.setValue('Pass123'); // 7 caracteres (6-18)
      
      expect(passwordControl?.errors?.['minlength']).toBeFalsy();
      expect(passwordControl?.errors?.['maxlength']).toBeFalsy();
      expect(passwordControl?.valid).toBeTrue();
    });

    it('6. debe validar formulario completo válido', () => {
      component.loginForm.patchValue({
        email: 'test@test.com',
        password: 'Pass123',
        rememberMe: false
      });
      
      expect(component.loginForm.valid).toBeTrue();
    });

    it('7. debe invalidar formulario con campos vacíos', () => {
      component.loginForm.patchValue({
        email: '',
        password: '',
        rememberMe: false
      });
      
      expect(component.loginForm.invalid).toBeTrue();
    });
  });

  // ============================================
  // PRUEBAS UNITARIAS - VALIDACIONES DE SOLICITUD
  // ============================================

  describe('Validaciones de Solicitud', () => {
    it('8. debe validar email inválido en solicitud', () => {
      const emailControl = component.solicitudForm.get('email');
      
      emailControl?.setValue('correo-sin-arroba');
      
      expect(emailControl?.errors?.['email']).toBeTruthy();
      expect(emailControl?.valid).toBeFalse();
    });

    it('9. debe validar teléfono con formato inválido', () => {
      const telefonoControl = component.solicitudForm.get('telefono');
      
      telefonoControl?.setValue('12345'); // menos de 9 dígitos
      
      expect(telefonoControl?.errors?.['pattern']).toBeTruthy();
      expect(telefonoControl?.valid).toBeFalse();
    });

    it('10. debe aceptar teléfono con 9 dígitos', () => {
      const telefonoControl = component.solicitudForm.get('telefono');
      
      telefonoControl?.setValue('912345678');
      
      expect(telefonoControl?.errors).toBeNull();
      expect(telefonoControl?.valid).toBeTrue();
    });

    it('11. debe validar contraseñas diferentes', () => {
      component.solicitudForm.patchValue({
        password: 'Pass123',
        confirmPassword: 'Pass456'
      });
      
      component.solicitudForm.updateValueAndValidity();
      
      const confirmPasswordControl = component.solicitudForm.get('confirmPassword');
      expect(confirmPasswordControl?.errors?.['passwordsNoCoinciden']).toBeTruthy();
    });

    it('12. debe validar contraseñas iguales', () => {
      component.solicitudForm.patchValue({
        password: 'Pass123',
        confirmPassword: 'Pass123'
      });
      
      component.solicitudForm.updateValueAndValidity();
      
      const confirmPasswordControl = component.solicitudForm.get('confirmPassword');
      expect(confirmPasswordControl?.errors?.['passwordsNoCoinciden']).toBeFalsy();
    });

    it('13. debe validar contraseña sin número', () => {
      const passwordControl = component.solicitudForm.get('password');
      
      passwordControl?.setValue('Password'); // solo letras
      
      expect(passwordControl?.errors?.['passwordDebil']).toBeTruthy();
      expect(passwordControl?.errors?.['passwordDebil'].tieneNumero).toBeFalse();
    });

    it('14. debe validar contraseña sin mayúscula', () => {
      const passwordControl = component.solicitudForm.get('password');
      
      passwordControl?.setValue('pass123'); // sin mayúscula
      
      expect(passwordControl?.errors?.['passwordDebil']).toBeTruthy();
      expect(passwordControl?.errors?.['passwordDebil'].tieneMayuscula).toBeFalse();
    });

    it('15. debe aceptar contraseña fuerte', () => {
      const passwordControl = component.solicitudForm.get('password');
      
      passwordControl?.setValue('Pass123'); // con mayúscula y número
      
      expect(passwordControl?.errors?.['passwordDebil']).toBeFalsy();
      expect(passwordControl?.valid).toBeTrue();
    });

    it('16. debe validar edad menor a 13 años', () => {
      const fechaNacimientoControl = component.solicitudForm.get('fechaNacimiento');
      
      // Fecha que da 10 años
      const fecha10Anos = new Date();
      fecha10Anos.setFullYear(fecha10Anos.getFullYear() - 10);
      
      fechaNacimientoControl?.setValue(fecha10Anos.toISOString().split('T')[0]);
      
      expect(fechaNacimientoControl?.errors?.['edadMinima']).toBeTruthy();
      expect(fechaNacimientoControl?.valid).toBeFalse();
    });

    it('17. debe aceptar edad de 13 años o más', () => {
      const fechaNacimientoControl = component.solicitudForm.get('fechaNacimiento');
      
      // Fecha que da 15 años
      const fecha15Anos = new Date();
      fecha15Anos.setFullYear(fecha15Anos.getFullYear() - 15);
      
      fechaNacimientoControl?.setValue(fecha15Anos.toISOString().split('T')[0]);
      
      expect(fechaNacimientoControl?.errors?.['edadMinima']).toBeFalsy();
      expect(fechaNacimientoControl?.valid).toBeTrue();
    });

    it('18. debe validar campo dirección como opcional', () => {
      const direccionControl = component.solicitudForm.get('direccion');
      
      // Campo vacío debe ser válido
      direccionControl?.setValue('');
      
      expect(direccionControl?.errors).toBeNull();
      expect(direccionControl?.valid).toBeTrue();
    });

    it('19. debe validar campo mensaje como opcional', () => {
      const mensajeControl = component.solicitudForm.get('mensaje');
      
      // Campo vacío debe ser válido
      mensajeControl?.setValue('');
      
      expect(mensajeControl?.errors).toBeNull();
      expect(mensajeControl?.valid).toBeTrue();
    });

    it('20. debe validar formulario de solicitud completo válido', () => {
      const fechaNacimiento = new Date();
      fechaNacimiento.setFullYear(fechaNacimiento.getFullYear() - 20);
      
      component.solicitudForm.patchValue({
        nombre: 'Juan Pérez',
        rut: '12.345.678-9',
        email: 'juan@test.com',
        telefono: '912345678',
        fechaNacimiento: fechaNacimiento.toISOString().split('T')[0],
        pasaje: '8651',
        casa: 'A',
        direccion: '', // opcional
        password: 'Pass123',
        confirmPassword: 'Pass123',
        mensaje: '' // opcional
      });
      
      expect(component.solicitudForm.valid).toBeTrue();
    });

    it('21. debe invalidar formulario de solicitud con campos requeridos vacíos', () => {
      component.solicitudForm.patchValue({
        nombre: '',
        rut: '',
        email: '',
        telefono: '',
        fechaNacimiento: '',
        pasaje: '',
        casa: '',
        password: '',
        confirmPassword: ''
      });
      
      expect(component.solicitudForm.invalid).toBeTrue();
    });
  });

  // ============================================
  // PRUEBAS UNITARIAS - MÉTODOS DEL COMPONENTE
  // ============================================

  describe('Métodos del componente', () => {
    it('22. debe limpiar formulario de login', () => {
      component.loginForm.patchValue({
        email: 'test@test.com',
        password: 'Pass123'
      });
      
      component.limpiarLogin();
      
      expect(component.loginForm.get('email')?.value).toBeNull();
      expect(component.loginForm.get('password')?.value).toBeNull();
    });

    it('23. debe limpiar formulario de solicitud', () => {
      component.solicitudForm.patchValue({
        nombre: 'Juan',
        email: 'juan@test.com'
      });
      
      component.limpiarSolicitud();
      
      expect(component.solicitudForm.get('nombre')?.value).toBeNull();
      expect(component.solicitudForm.get('email')?.value).toBeNull();
    });

    it('24. debe alternar visibilidad de contraseña', () => {
      expect(component.mostrarPassword).toBeFalse();
      
      component.togglePassword();
      expect(component.mostrarPassword).toBeTrue();
      
      component.togglePassword();
      expect(component.mostrarPassword).toBeFalse();
    });

    it('25. debe cargar casas disponibles al cambiar pasaje 8651', () => {
      component.onPasajeChange('8651');
      
      expect(component.casasDisponibles.length).toBe(6);
      expect(component.casasDisponibles).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);
    });

    it('26. debe cargar casas disponibles al cambiar pasaje 8707', () => {
      component.onPasajeChange('8707');
      
      expect(component.casasDisponibles.length).toBe(7);
      expect(component.casasDisponibles).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
    });

    it('27. debe resetear casa al cambiar pasaje', () => {
      component.solicitudForm.patchValue({
        pasaje: '8651',
        casa: 'A'
      });
      
      component.onPasajeChange('8707');
      
      expect(component.solicitudForm.get('casa')?.value).toBe('');
    });

    it('28. debe verificar si un campo tiene error', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('');
      emailControl?.markAsTouched();
      
      const tieneError = component.tieneError('login', 'email');
      
      expect(tieneError).toBeTrue();
    });

    it('29. debe obtener mensaje de error apropiado', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('correo-invalido');
      emailControl?.markAsTouched();
      
      const mensaje = component.obtenerMensajeError('login', 'email');
      
      expect(mensaje).toBe('Ingrese un email válido');
    });
  });
});
