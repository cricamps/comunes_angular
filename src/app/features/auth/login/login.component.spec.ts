import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';

describe('LoginComponent - Semana 5', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'login',
      'isAdmin',
      'getCurrentUser',
      'logout'
    ]);

    // Mock getCurrentUser para navbar
    authServiceSpy.getCurrentUser.and.returnValue({
      email: 'test@test.com',
      password: 'Test123!',
      nombre: 'Test User',
      rut: '12345678-9',
      telefono: '+56912345678',
      rol: 'residente',
      tipo: 'residente',
      pasaje: '8651',
      casa: 'A',
      fechaRegistro: new Date()
    });
    authServiceSpy.isAdmin.and.returnValue(false);
    authServiceSpy.logout.and.stub();

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule
      ],
      providers: [
        provideRouter([]), // Proveedor de router vacío para tests
        { provide: AuthService, useValue: authServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignora componentes hijos como navbar
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    
    // NO llamar fixture.detectChanges() aquí
    // Se llamará manualmente en cada test si es necesario
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ============================================
  // PRUEBAS UNITARIAS - VALIDACIONES DE LOGIN
  // ============================================

  describe('Validaciones de Login', () => {
    beforeEach(() => {
      // Inicializar el componente manualmente
      component.ngOnInit();
    });

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
      
      passwordControl?.setValue('12345');
      
      expect(passwordControl?.errors?.['minlength']).toBeTruthy();
      expect(passwordControl?.valid).toBeFalse();
    });

    it('4. debe aceptar contraseña válida', () => {
      const passwordControl = component.loginForm.get('password');
      
      passwordControl?.setValue('Admin123!');
      
      expect(passwordControl?.errors).toBeNull();
      expect(passwordControl?.valid).toBeTrue();
    });

    it('5. debe requerir email y password', () => {
      const emailControl = component.loginForm.get('email');
      const passwordControl = component.loginForm.get('password');
      
      expect(emailControl?.hasError('required')).toBeTrue();
      expect(passwordControl?.hasError('required')).toBeTrue();
    });

    it('6. debe invalidar formulario vacío', () => {
      expect(component.loginForm.valid).toBeFalse();
    });

    it('7. debe validar formulario completo', () => {
      component.loginForm.patchValue({
        email: 'test@test.com',
        password: 'Test123!'
      });
      
      expect(component.loginForm.valid).toBeTrue();
    });

    it('8. debe detectar email requerido', () => {
      const emailControl = component.loginForm.get('email');
      
      emailControl?.setValue('');
      emailControl?.markAsTouched();
      
      expect(emailControl?.hasError('required')).toBeTrue();
    });

    it('9. debe detectar password requerido', () => {
      const passwordControl = component.loginForm.get('password');
      
      passwordControl?.setValue('');
      passwordControl?.markAsTouched();
      
      expect(passwordControl?.hasError('required')).toBeTrue();
    });

    it('10. debe validar email con formato específico', () => {
      const emailControl = component.loginForm.get('email');
      
      const emailsInvalidos = ['test', 'test@', '@test.com', 'test.com'];
      const emailsValidos = ['test@test.com', 'usuario@example.com'];
      
      emailsInvalidos.forEach(email => {
        emailControl?.setValue(email);
        expect(emailControl?.errors?.['email']).toBeTruthy();
      });
      
      emailsValidos.forEach(email => {
        emailControl?.setValue(email);
        expect(emailControl?.errors).toBeNull();
      });
    });
  });
});
