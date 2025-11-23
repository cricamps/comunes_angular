import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Crear mocks de los servicios
    mockAuthService = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'logout']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Configurar el mock para retornar un usuario normal
    mockAuthService.getCurrentUser.and.returnValue({
      id: 2,
      rut: '98765432-1',
      nombre: 'Usuario',
      apellido: 'Test',
      email: 'user@test.com',
      telefono: '+56987654321',
      departamento: '102',
      rol: 'usuario',
      password: 'user123'
    });

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user data on init', () => {
    expect(component.usuarioActual).toBeTruthy();
    expect(component.usuarioActual?.nombre).toBe('Usuario');
  });

  it('should filter gastos by user department', () => {
    expect(component.gastosUsuario).toBeDefined();
  });

  it('should logout and navigate to login', () => {
    component.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});
