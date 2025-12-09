import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { EstadisticasGastosComponent } from './estadisticas-gastos.component';
import { CasasService } from '../../../core/services/casas.service';
import { ConceptosGastosService } from '../../../core/services/conceptos-gastos.service';
import { PagosHistoricosService } from '../../../core/services/pagos-historicos.service';

describe('EstadisticasGastosComponent', () => {
  let component: EstadisticasGastosComponent;
  let fixture: ComponentFixture<EstadisticasGastosComponent>;

  beforeEach(async () => {
    // Mock ActivatedRoute
    const mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: () => null
        }
      },
      params: of({}),
      queryParams: of({})
    };

    await TestBed.configureTestingModule({
      imports: [EstadisticasGastosComponent, HttpClientTestingModule],
      providers: [
        CasasService,
        ConceptosGastosService,
        PagosHistoricosService,
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EstadisticasGastosComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with loading state', () => {
    expect(component.cargando).toBeTrue();
  });

  it('should have empty arrays initially', () => {
    expect(component.conceptosGastos).toEqual([]);
    expect(component.conceptosActivos).toEqual([]);
    expect(component.pagosHistoricos).toEqual([]);
    expect(component.pagosPendientes).toEqual([]);
  });

  it('should calculate percentage correctly', () => {
    component.totalMensualConceptos = 100000;
    component.gastosPorCategoria = {
      'Servicios Básicos': 30000
    };
    
    const porcentaje = component.getPorcentajeCategoria('Servicios Básicos');
    expect(porcentaje).toBe(30);
  });

  it('should return 0 percentage when total is 0', () => {
    component.totalMensualConceptos = 0;
    component.gastosPorCategoria = {
      'Servicios Básicos': 30000
    };
    
    const porcentaje = component.getPorcentajeCategoria('Servicios Básicos');
    expect(porcentaje).toBe(0);
  });

  it('should translate categoria correctly', () => {
    expect(component.traducirCategoria('servicios-basicos')).toBe('Servicios Básicos');
    expect(component.traducirCategoria('mantenimiento')).toBe('Mantenimiento');
    expect(component.traducirCategoria('seguros')).toBe('Seguros');
    expect(component.traducirCategoria('administracion')).toBe('Administración');
  });

  it('should return correct badge class', () => {
    expect(component.getBadgeClass(90)).toBe('bg-success');
    expect(component.getBadgeClass(60)).toBe('bg-warning');
    expect(component.getBadgeClass(30)).toBe('bg-danger');
  });
});
