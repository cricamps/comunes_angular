import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ListaCasasComponent } from './lista-casas.component';
import { CasasService } from '../../../core/services/casas.service';
import { Casa } from '../../../models/casa.interface';

describe('ListaCasasComponent', () => {
  let component: ListaCasasComponent;
  let fixture: ComponentFixture<ListaCasasComponent>;
  let casasService: jasmine.SpyObj<CasasService>;

  const mockCasas: Casa[] = [
    {
      id: 1,
      numeroCasa: '8651-1',
      pasaje: 'Pasaje 8651',
      direccion: 'Pasaje 8651, Casa 1',
      residente: {
        nombre: 'Juan Pérez',
        rut: '12345678-9',
        email: 'juan.perez@email.com',
        telefono: '+56912345678'
      },
      metrosCuadrados: 120,
      cantidadHabitantes: 4,
      activa: true
    },
    {
      id: 2,
      numeroCasa: '8707-1',
      pasaje: 'Pasaje 8707',
      direccion: 'Pasaje 8707, Casa 1',
      residente: {
        nombre: 'María González',
        rut: '23456789-0',
        email: 'maria.gonzalez@email.com',
        telefono: '+56923456789'
      },
      metrosCuadrados: 115,
      cantidadHabitantes: 3,
      activa: true
    }
  ];

  beforeEach(async () => {
    const casasServiceSpy = jasmine.createSpyObj('CasasService', [
      'getCasas',
      'getTotalMetrosCuadrados',
      'getTotalHabitantes'
    ]);

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
      imports: [ListaCasasComponent, HttpClientTestingModule],
      providers: [
        { provide: CasasService, useValue: casasServiceSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    casasService = TestBed.inject(CasasService) as jasmine.SpyObj<CasasService>;
    fixture = TestBed.createComponent(ListaCasasComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load casas on init', () => {
    casasService.getCasas.and.returnValue(of(mockCasas));
    casasService.getTotalMetrosCuadrados.and.returnValue(of(235));
    casasService.getTotalHabitantes.and.returnValue(of(7));

    component.ngOnInit();

    expect(component.casas.length).toBe(2);
    expect(component.cargando).toBeFalse();
  });

  it('should separate casas by pasaje', () => {
    casasService.getCasas.and.returnValue(of(mockCasas));
    casasService.getTotalMetrosCuadrados.and.returnValue(of(235));
    casasService.getTotalHabitantes.and.returnValue(of(7));

    component.ngOnInit();

    expect(component.casasPasaje8651.length).toBe(1);
    expect(component.casasPasaje8707.length).toBe(1);
  });

  it('should load estadisticas', () => {
    casasService.getCasas.and.returnValue(of(mockCasas));
    casasService.getTotalMetrosCuadrados.and.returnValue(of(235));
    casasService.getTotalHabitantes.and.returnValue(of(7));

    component.ngOnInit();

    expect(component.totalMetrosCuadrados).toBe(235);
    expect(component.totalHabitantes).toBe(7);
  });

  it('should handle error when loading casas', () => {
    const errorMessage = 'Error de red';
    casasService.getCasas.and.returnValue(throwError(() => new Error(errorMessage)));
    casasService.getTotalMetrosCuadrados.and.returnValue(of(0));
    casasService.getTotalHabitantes.and.returnValue(of(0));

    component.ngOnInit();

    expect(component.error).toBeTruthy();
    expect(component.cargando).toBeFalse();
  });

  it('should return correct estado clase', () => {
    expect(component.getEstadoClase(true)).toBe('badge bg-success');
    expect(component.getEstadoClase(false)).toBe('badge bg-secondary');
  });

  it('should return correct estado texto', () => {
    expect(component.getEstadoTexto(true)).toBe('Activa');
    expect(component.getEstadoTexto(false)).toBe('Inactiva');
  });
});
