import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistroComponent } from './registro.component';

describe('RegistroComponent - Pruebas Unitarias Semana 5', () => {
  let component: RegistroComponent;
  let fixture: ComponentFixture<RegistroComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Crear mock del Router
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RegistroComponent, ReactiveFormsModule],
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ============================================
  // PRUEBA 1: VALIDACIÓN DE CONTRASEÑAS
  // ============================================
  describe('PRUEBA 1: Validación de Contraseñas', () => {
    
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form with all required fields', () => {
      expect(component.registroForm).toBeDefined();
      expect(component.registroForm.get('nombre')).toBeDefined();
      expect(component.registroForm.get('rut')).toBeDefined();
      expect(component.registroForm.get('email')).toBeDefined();
      expect(component.registroForm.get('telefono')).toBeDefined();
      expect(component.registroForm.get('fechaNacimiento')).toBeDefined();
      expect(component.registroForm.get('pasaje')).toBeDefined();
      expect(component.registroForm.get('casa')).toBeDefined();
      expect(component.registroForm.get('direccionDespacho')).toBeDefined();
      expect(component.registroForm.get('password')).toBeDefined();
      expect(component.registroForm.get('confirmPassword')).toBeDefined();
    });

    it('should be invalid when password is empty', () => {
      const passwordControl = component.registroForm.get('password');
      passwordControl?.setValue('');
      
      expect(passwordControl?.valid).toBeFalsy();
      expect(passwordControl?.errors?.['required']).toBeTruthy();
    });

    it('should be invalid when password is less than 6 characters', () => {
      const passwordControl = component.registroForm.get('password');
      passwordControl?.setValue('Abc1');
      
      expect(passwordControl?.valid).toBeFalsy();
      expect(passwordControl?.errors?.['passwordLength']).toBeTruthy();
    });

    it('should be invalid when password is more than 18 characters', () => {
      const passwordControl = component.registroForm.get('password');
      passwordControl?.setValue('Abc123456789012345678');
      
      expect(passwordControl?.valid).toBeFalsy();
      expect(passwordControl?.errors?.['passwordLength']).toBeTruthy();
    });

    it('should be invalid when password does not contain uppercase letter', () => {
      const passwordControl = component.registroForm.get('password');
      passwordControl?.setValue('abc1234');
      
      expect(passwordControl?.valid).toBeFalsy();
      expect(passwordControl?.errors?.['passwordStrength']).toBeTruthy();
      expect(passwordControl?.errors?.['passwordStrength'].hasUpperCase).toBeFalsy();
    });

    it('should be invalid when password does not contain number', () => {
      const passwordControl = component.registroForm.get('password');
      passwordControl?.setValue('Abcdefg');
      
      expect(passwordControl?.valid).toBeFalsy();
      expect(passwordControl?.errors?.['passwordStrength']).toBeTruthy();
      expect(passwordControl?.errors?.['passwordStrength'].hasNumber).toBeFalsy();
    });

    it('should be valid when password meets all requirements', () => {
      const passwordControl = component.registroForm.get('password');
      passwordControl?.setValue('Password123');
      
      expect(passwordControl?.valid).toBeTruthy();
      expect(passwordControl?.errors).toBeNull();
    });

    it('should show error when passwords do not match', () => {
      component.registroForm.patchValue({
        password: 'Password123',
        confirmPassword: 'Password456'
      });

      expect(component.registroForm.errors?.['passwordMismatch']).toBeTruthy();
    });

    it('should be valid when passwords match', () => {
      component.registroForm.patchValue({
        password: 'Password123',
        confirmPassword: 'Password123'
      });

      // Disparar el validador manualmente
      component.registroForm.updateValueAndValidity();

      expect(component.registroForm.errors?.['passwordMismatch']).toBeFalsy();
    });

    it('should validate password with exactly 6 characters', () => {
      const passwordControl = component.registroForm.get('password');
      passwordControl?.setValue('Pass12');
      
      expect(passwordControl?.valid).toBeTruthy();
    });

    it('should validate password with exactly 18 characters', () => {
      const passwordControl = component.registroForm.get('password');
      passwordControl?.setValue('Password1234567890');
      
      expect(passwordControl?.valid).toBeTruthy();
    });
  });

  // ============================================
  // PRUEBA 2: VALIDACIÓN DE EDAD MÍNIMA
  // ============================================
  describe('PRUEBA 2: Validación de Edad Mínima (13 años)', () => {

    it('should be invalid when age is less than 13 years', () => {
      const fechaNacimientoControl = component.registroForm.get('fechaNacimiento');
      
      // Fecha de hace 10 años (menor de 13)
      const fechaMenor13 = new Date();
      fechaMenor13.setFullYear(fechaMenor13.getFullYear() - 10);
      
      fechaNacimientoControl?.setValue(fechaMenor13.toISOString().split('T')[0]);
      
      expect(fechaNacimientoControl?.valid).toBeFalsy();
      expect(fechaNacimientoControl?.errors?.['minAge']).toBeTruthy();
      expect(fechaNacimientoControl?.errors?.['minAge'].minAge).toBe(13);
      expect(fechaNacimientoControl?.errors?.['minAge'].actualAge).toBeLessThan(13);
    });

    it('should be invalid when age is exactly 12 years', () => {
      const fechaNacimientoControl = component.registroForm.get('fechaNacimiento');
      
      // Fecha de exactamente 12 años atrás
      const fecha12 = new Date();
      fecha12.setFullYear(fecha12.getFullYear() - 12);
      fecha12.setMonth(fecha12.getMonth() - 1); // Un mes menos para asegurar
      
      fechaNacimientoControl?.setValue(fecha12.toISOString().split('T')[0]);
      
      expect(fechaNacimientoControl?.valid).toBeFalsy();
      expect(fechaNacimientoControl?.errors?.['minAge']).toBeTruthy();
    });

    it('should be valid when age is exactly 13 years', () => {
      const fechaNacimientoControl = component.registroForm.get('fechaNacimiento');
      
      // Fecha de exactamente 13 años atrás
      const fecha13 = new Date();
      fecha13.setFullYear(fecha13.getFullYear() - 13);
      fecha13.setDate(fecha13.getDate() - 1); // Un día menos para asegurar
      
      fechaNacimientoControl?.setValue(fecha13.toISOString().split('T')[0]);
      
      expect(fechaNacimientoControl?.valid).toBeTruthy();
      expect(fechaNacimientoControl?.errors).toBeNull();
    });

    it('should be valid when age is 18 years', () => {
      const fechaNacimientoControl = component.registroForm.get('fechaNacimiento');
      
      // Fecha de 18 años atrás
      const fecha18 = new Date();
      fecha18.setFullYear(fecha18.getFullYear() - 18);
      
      fechaNacimientoControl?.setValue(fecha18.toISOString().split('T')[0]);
      
      expect(fechaNacimientoControl?.valid).toBeTruthy();
      expect(fechaNacimientoControl?.errors).toBeNull();
    });

    it('should be valid when age is 25 years', () => {
      const fechaNacimientoControl = component.registroForm.get('fechaNacimiento');
      
      // Fecha de 25 años atrás
      const fecha25 = new Date();
      fecha25.setFullYear(fecha25.getFullYear() - 25);
      
      fechaNacimientoControl?.setValue(fecha25.toISOString().split('T')[0]);
      
      expect(fechaNacimientoControl?.valid).toBeTruthy();
      expect(fechaNacimientoControl?.errors).toBeNull();
    });

    it('should show correct error message for underage', () => {
      const fechaNacimientoControl = component.registroForm.get('fechaNacimiento');
      
      // Fecha de hace 10 años
      const fechaMenor13 = new Date();
      fechaMenor13.setFullYear(fechaMenor13.getFullYear() - 10);
      
      fechaNacimientoControl?.setValue(fechaMenor13.toISOString().split('T')[0]);
      fechaNacimientoControl?.markAsTouched();
      
      const mensajeError = component.obtenerMensajeError('fechaNacimiento');
      expect(mensajeError).toContain('13 años');
    });
  });

  // ============================================
  // PRUEBAS ADICIONALES
  // ============================================
  describe('Validaciones Adicionales', () => {

    it('should validate email format', () => {
      const emailControl = component.registroForm.get('email');
      
      // Email inválido
      emailControl?.setValue('invalid-email');
      expect(emailControl?.valid).toBeFalsy();
      
      // Email válido
      emailControl?.setValue('test@email.com');
      expect(emailControl?.valid).toBeTruthy();
    });

    it('should validate RUT format', () => {
      const rutControl = component.registroForm.get('rut');
      
      // RUT inválido
      rutControl?.setValue('12.345.678-0');
      expect(rutControl?.valid).toBeFalsy();
      
      // RUT válido
      rutControl?.setValue('12.345.678-5');
      expect(rutControl?.valid).toBeTruthy();
    });

    it('should validate telefono chileno format', () => {
      const telefonoControl = component.registroForm.get('telefono');
      
      // Teléfono inválido (no comienza con 9)
      telefonoControl?.setValue('812345678');
      expect(telefonoControl?.valid).toBeFalsy();
      
      // Teléfono válido
      telefonoControl?.setValue('912345678');
      expect(telefonoControl?.valid).toBeTruthy();
    });

    it('should mark direccionDespacho as optional', () => {
      const direccionControl = component.registroForm.get('direccionDespacho');
      
      // Campo vacío debe ser válido (es opcional)
      direccionControl?.setValue('');
      expect(direccionControl?.valid).toBeTruthy();
      
      // Campo con valor también debe ser válido
      direccionControl?.setValue('Pasaje 8651, Casa A');
      expect(direccionControl?.valid).toBeTruthy();
    });

    it('should require pasaje selection', () => {
      const pasajeControl = component.registroForm.get('pasaje');
      
      pasajeControl?.setValue('');
      expect(pasajeControl?.valid).toBeFalsy();
      
      pasajeControl?.setValue('8651');
      expect(pasajeControl?.valid).toBeTruthy();
    });

    it('should update available houses when pasaje changes', () => {
      component.registroForm.patchValue({ pasaje: '8651' });
      expect(component.casasDisponibles.length).toBe(6);
      
      component.registroForm.patchValue({ pasaje: '8707' });
      expect(component.casasDisponibles.length).toBe(7);
    });
  });

  // ============================================
  // PRUEBAS DE FUNCIONALIDAD
  // ============================================
  describe('Funcionalidad del Componente', () => {

    it('should toggle password visibility', () => {
      expect(component.mostrarPassword).toBeFalsy();
      
      component.togglePassword();
      expect(component.mostrarPassword).toBeTruthy();
      
      component.togglePassword();
      expect(component.mostrarPassword).toBeFalsy();
    });

    it('should clear form when limpiarFormulario is called', () => {
      // Llenar formulario
      component.registroForm.patchValue({
        nombre: 'Test',
        email: 'test@email.com',
        password: 'Password123'
      });
      
      component.limpiarFormulario();
      
      expect(component.registroForm.get('nombre')?.value).toBeNull();
      expect(component.registroForm.get('email')?.value).toBeNull();
      expect(component.formularioEnviado).toBeFalsy();
    });

    it('should not submit invalid form', () => {
      component.registroForm.patchValue({
        nombre: 'Test'
        // Resto de campos vacíos
      });
      
      component.onSubmit();
      
      expect(component.formularioEnviado).toBeTruthy();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should submit valid form and navigate to login', () => {
      // Llenar formulario con datos válidos
      const fecha13 = new Date();
      fecha13.setFullYear(fecha13.getFullYear() - 15);
      
      component.registroForm.patchValue({
        nombre: 'Juan Pérez',
        rut: '12.345.678-5',
        email: 'juan@email.com',
        telefono: '912345678',
        fechaNacimiento: fecha13.toISOString().split('T')[0],
        pasaje: '8651',
        casa: 'A',
        direccionDespacho: '',
        password: 'Password123',
        confirmPassword: 'Password123'
      });
      
      spyOn(window, 'alert'); // Mock del alert
      
      component.onSubmit();
      
      expect(component.registroForm.valid).toBeTruthy();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should format RUT correctly', () => {
      const event = {
        target: { value: '123456785' }
      };
      
      component.formatearRUT(event);
      
      expect(component.registroForm.get('rut')?.value).toBe('12.345.678-5');
    });

    it('should detect field errors correctly', () => {
      const nombreControl = component.registroForm.get('nombre');
      
      // Campo sin tocar no debe mostrar error
      expect(component.tieneError('nombre')).toBeFalsy();
      
      // Campo tocado y vacío debe mostrar error
      nombreControl?.setValue('');
      nombreControl?.markAsTouched();
      expect(component.tieneError('nombre')).toBeTruthy();
      
      // Campo tocado y válido no debe mostrar error
      nombreControl?.setValue('Juan Pérez');
      expect(component.tieneError('nombre')).toBeFalsy();
    });
  });

  // ============================================
  // PRUEBA INTEGRADA: FORMULARIO COMPLETO
  // ============================================
  describe('Prueba Integrada: Formulario Completo', () => {

    it('should validate complete form with all requirements', () => {
      const fecha15 = new Date();
      fecha15.setFullYear(fecha15.getFullYear() - 15);
      
      const datosValidos = {
        nombre: 'María González López',
        rut: '18.765.432-0',
        email: 'maria.gonzalez@email.com',
        telefono: '987654321',
        fechaNacimiento: fecha15.toISOString().split('T')[0],
        pasaje: '8707',
        casa: 'C',
        direccionDespacho: 'Pasaje 8707, Casa C',
        password: 'SecurePass123',
        confirmPassword: 'SecurePass123'
      };
      
      component.registroForm.patchValue(datosValidos);
      
      // Verificar que el formulario es válido
      expect(component.registroForm.valid).toBeTruthy();
      
      // Verificar cada campo individualmente
      Object.keys(datosValidos).forEach(key => {
        const control = component.registroForm.get(key);
        expect(control?.valid).toBeTruthy(`${key} should be valid`);
      });
    });
  });
});
