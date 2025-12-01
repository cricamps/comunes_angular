import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RealizarPagoComponent } from './realizar-pago.component';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CarritoService } from '../../../core/services/carrito.service';
import { of } from 'rxjs';

describe('RealizarPagoComponent', () => {
  let component: RealizarPagoComponent;
  let fixture: ComponentFixture<RealizarPagoComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockCarritoService: jasmine.SpyObj<CarritoService>;

  beforeEach(async () => {
    // Crear mocks con TODOS los métodos necesarios
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'getPasaje',
      'getCasa',
      'getNombreUsuario',
      'getCurrentUser',
      'isAdmin',
      'logout'
    ]);
    mockCarritoService = jasmine.createSpyObj('CarritoService', [
      'obtenerItems',
      'calcularTotal',
      'obtenerCantidadSeleccionados',
      'agregarCuota',
      'eliminarCuota',
      'toggleSeleccion',
      'seleccionarTodas',
      'deseleccionarTodas',
      'estaEnCarrito',
      'vaciarCarrito',
      'procesarPago'
    ]);

    // Mock de ActivatedRoute
    const mockActivatedRoute = {
      snapshot: {
        params: {}
      },
      params: of({})
    };

    // Configurar valores por defecto de los mocks
    mockAuthService.getPasaje.and.returnValue('8651');
    mockAuthService.getCasa.and.returnValue('B');
    mockAuthService.getNombreUsuario.and.returnValue('Usuario Test');
    mockAuthService.isAdmin.and.returnValue(false);
    mockAuthService.logout.and.stub();
    mockAuthService.getCurrentUser.and.returnValue({
      email: 'usuario@comunes.cl',
      password: 'User123!',
      nombre: 'Usuario Test',
      rut: '12345678-9',
      telefono: '+56912345678',
      rol: 'residente',
      tipo: 'residente',
      pasaje: '8651',
      casa: 'B',
      fechaRegistro: new Date('2024-01-01')
    });
    mockCarritoService.obtenerItems.and.returnValue([]);
    mockCarritoService.calcularTotal.and.returnValue(0);
    mockCarritoService.obtenerCantidadSeleccionados.and.returnValue(0);

    await TestBed.configureTestingModule({
      imports: [RealizarPagoComponent]
    })
    .overrideComponent(RealizarPagoComponent, {
      set: {
        imports: [CommonModule],
        providers: [
          { provide: Router, useValue: mockRouter },
          { provide: ActivatedRoute, useValue: mockActivatedRoute },
          { provide: AuthService, useValue: mockAuthService },
          { provide: CarritoService, useValue: mockCarritoService }
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA] // ← Ignora elementos desconocidos como app-navbar
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealizarPagoComponent);
    component = fixture.componentInstance;
    
    // Inyectar manualmente los servicios
    (component as any).router = mockRouter;
    (component as any).authService = mockAuthService;
    (component as any).carritoService = mockCarritoService;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar datos del usuario al iniciar', () => {
    // Act
    component.ngOnInit();

    // Assert
    expect(component.pasaje).toBe('8651');
    expect(component.casa).toBe('B');
    expect(component.nombreUsuario).toBe('Usuario Test');
  });

  it('debe redirigir a login si no hay sesión', () => {
    // Arrange
    mockAuthService.getPasaje.and.returnValue('');
    mockAuthService.getCasa.and.returnValue('');

    // Act
    component.ngOnInit();

    // Assert
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('debe actualizar carrito correctamente', () => {
    // Arrange
    const itemsMock: any[] = [];
    mockCarritoService.obtenerItems.and.returnValue(itemsMock);
    mockCarritoService.calcularTotal.and.returnValue(15000);
    mockCarritoService.obtenerCantidadSeleccionados.and.returnValue(3);

    // Act
    component.actualizarCarrito();

    // Assert
    expect(component.items).toEqual(itemsMock);
    expect(component.total).toBe(15000);
    expect(component.cantidadSeleccionados).toBe(3);
  });
});
