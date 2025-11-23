import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'isAdmin']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ============================================
  // PRUEBAS UNITARIAS - VALIDACIONES
  // ============================================

  describe('Validaciones de Login', () => {
    it('debe validar email inválido', () => {
      const emailControl = component.loginForm.get('email');
      
      emailControl?.setValue('correo-invalido');
      
      expect(emailControl?.errors?.['email']).toBeTruthy();
      expect(emailControl?.valid).toBeFalse();
    });

    it('debe aceptar email válido', () => {
      const emailControl = component.loginForm.get('email');
      
      emailControl?.setValue('test@test.com');
      
      expect(emailControl?.errors).toBeNull();
      expect(emailControl?.valid).toBeTrue();
    });

    it('debe validar contraseña con longitud mínima', () => {
      const passwordControl = component.loginForm.get('password');
      
      passwordControl?.setValue('12345'); // 5 caracteres (menos de 6)
      
      expect(passwordControl?.errors?.['minlength']).toBeTruthy();
      expect(passwordControl?.valid).toBeFalse();
    });

    it('debe validar contraseña con longitud máxima', () => {
      const passwordControl = component.loginForm.get('password');
      
      passwordControl?.setValue('1234567890123456789'); // 19 caracteres (más de 18)
      
      expect(passwordControl?.errors?.['maxlength']).toBeTruthy();
      expect(passwordControl?.valid).toBeFalse();
    });

    it('debe aceptar contraseña con longitud válida', () => {
      const passwordControl = component.loginForm.get('password');
      
      passwordControl?.setValue('Pass123'); // 7 caracteres (6-18)
      
      expect(passwordControl?.errors?.['minlength']).toBeFalsy();
      expect(passwordControl?.errors?.['maxlength']).toBeFalsy();
      expect(passwordControl?.valid).toBeTrue();
    });

    it('debe validar formulario completo válido', () => {
      component.loginForm.patchValue({
        email: 'test@test.com',
        password: 'Pass123',
        rememberMe: false
      });
      
      expect(component.loginForm.valid).toBeTrue();
    });

    it('debe invalidar formulario con campos vacíos', () => {
      component.loginForm.patchValue({
        email: '',
        password: '',
        rememberMe: false
      });
      
      expect(component.loginForm.invalid).toBeTrue();
    });
  });

  describe('Validaciones de Solicitud', () => {
    it('debe validar email inválido en solicitud', () => {
      const emailControl = component.solicitudForm.get('email');
      
      emailControl?.setValue('correo-sin-arroba');
      
      expect(emailControl?.errors?.['email']).toBeTruthy();
      expect(emailControl?.valid).toBeFalse();
    });

    it('debe validar teléfono con formato inválido', () => {
      const telefonoControl = component.solicitudForm.get('telefono');
      
      telefonoControl?.setValue('12345'); // menos de 9 dígitos
      
      expect(telefonoControl?.errors?.['pattern']).toBeTruthy();
      expect(telefonoControl?.valid).toBeFalse();
    });

    it('debe aceptar teléfono con 9 dígitos', () => {
      const telefonoControl = component.solicitudForm.get('telefono');
      
      telefonoControl?.setValue('912345678');
      
      expect(telefonoControl?.errors).toBeNull();
      expect(telefonoControl?.valid).toBeTrue();
    });

    it('debe validar contraseñas diferentes', () => {
      component.solicitudForm.patchValue({
        password: 'Pass123',
        confirmPassword: 'Pass456'
      });
      
      // Ejecutar validator del formulario
      component.solicitudForm.updateValueAndValidity();
      
      const confirmPasswordControl = component.solicitudForm.get('confirmPassword');
      expect(confirmPasswordControl?.errors?.['passwordsNoCoinciden']).toBeTruthy();
    });

    it('debe validar contraseñas iguales', () => {
      component.solicitudForm.patchValue({
        password: 'Pass123',
        confirmPassword: 'Pass123'
      });
      
      component.solicitudForm.updateValueAndValidity();
      
      const confirmPasswordControl = component.solicitudForm.get('confirmPassword');
      expect(confirmPasswordControl?.errors?.['passwordsNoCoinciden']).toBeFalsy();
    });

    it('debe validar contraseña sin número', () => {
      const passwordControl = component.solicitudForm.get('password');
      
      passwordControl?.setValue('Password'); // solo letras
      
      expect(passwordControl?.errors?.['passwordDebil']).toBeTruthy();
      expect(passwordControl?.errors?.['passwordDebil'].tieneNumero).toBeFalse();
    });

    it('debe validar contraseña sin mayúscula', () => {
      const passwordControl = component.solicitudForm.get('password');
      
      passwordControl?.setValue('pass123'); // sin mayúscula
      
      expect(passwordControl?.errors?.['passwordDebil']).toBeTruthy();
      expect(passwordControl?.errors?.['passwordDebil'].tieneMayuscula).toBeFalse();
    });

    it('debe aceptar contraseña fuerte', () => {
      const passwordControl = component.solicitudForm.get('password');
      
      passwordControl?.setValue('Pass123'); // con mayúscula y número
      
      expect(passwordControl?.errors?.['passwordDebil']).toBeFalsy();
      expect(passwordControl?.valid).toBeTrue();
    });

    it('debe validar edad menor a 13 años', () => {
      const fechaNacimientoControl = component.solicitudForm.get('fechaNacimiento');
      
      // Fecha que da 10 años
      const fecha10Anos = new Date();
      fecha10Anos.setFullYear(fecha10Anos.getFullYear() - 10);
      
      fechaNacimientoControl?.setValue(fecha10Anos.toISOString().split('T')[0]);
      
      expect(fechaNacimientoControl?.errors?.['edadMinima']).toBeTruthy();
      expect(fechaNacimientoControl?.valid).toBeFalse();
    });

    it('debe aceptar edad de 13 años o más', () => {
      const fechaNacimientoControl = component.solicitudForm.get('fechaNacimiento');
      
      // Fecha que da 15 años
      const fecha15Anos = new Date();
      fecha15Anos.setFullYear(fecha15Anos.getFullYear() - 15);
      
      fechaNacimientoControl?.setValue(fecha15Anos.toISOString().split('T')[0]);
      
      expect(fechaNacimientoControl?.errors?.['edadMinima']).toBeFalsy();
      expect(fechaNacimientoControl?.valid).toBeTrue();
    });

    it('debe validar campo dirección como opcional', () => {
      const direccionControl = component.solicitudForm.get('direccion');
      
      // Campo vacío debe ser válido
      direccionControl?.setValue('');
      
      expect(direccionControl?.errors).toBeNull();
      expect(direccionControl?.valid).toBeTrue();
    });

    it('debe validar campo mensaje como opcional', () => {
      const mensajeControl = component.solicitudForm.get('mensaje');
      
      // Campo vacío debe ser válido
      mensajeControl?.setValue('');
      
      expect(mensajeControl?.errors).toBeNull();
      expect(mensajeControl?.valid).toBeTrue();
    });

    it('debe validar formulario de solicitud completo válido', () => {
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

    it('debe invalidar formulario de solicitud con campos requeridos vacíos', () => {
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

  describe('Métodos del componente', () => {
    it('debe limpiar formulario de login', () => {
      component.loginForm.patchValue({
        email: 'test@test.com',
        password: 'Pass123'
      });
      
      component.limpiarLogin();
      
      expect(component.loginForm.get('email')?.value).toBeNull();
      expect(component.loginForm.get('password')?.value).toBeNull();
    });

    it('debe limpiar formulario de solicitud', () => {
      component.solicitudForm.patchValue({
        nombre: 'Juan',
        email: 'juan@test.com'
      });
      
      component.limpiarSolicitud();
      
      expect(component.solicitudForm.get('nombre')?.value).toBeNull();
      expect(component.solicitudForm.get('email')?.value).toBeNull();
    });

    it('debe alternar visibilidad de contraseña', () => {
      expect(component.mostrarPassword).toBeFalse();
      
      component.togglePassword();
      expect(component.mostrarPassword).toBeTrue();
      
      component.togglePassword();
      expect(component.mostrarPassword).toBeFalse();
    });

    it('debe cargar casas disponibles al cambiar pasaje', () => {
      component.onPasajeChange('8651');
      
      expect(component.casasDisponibles.length).toBe(6);
      expect(component.casasDisponibles).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);
    });

    it('debe cargar diferentes casas para pasaje 8707', () => {
      component.onPasajeChange('8707');
      
      expect(component.casasDisponibles.length).toBe(7);
      expect(component.casasDisponibles).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
    });
  });
});
