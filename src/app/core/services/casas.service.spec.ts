import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CasasService } from './casas.service';
import { Casa } from '../../models/casa.interface';

describe('CasasService', () => {
  let service: CasasService;
  let httpMock: HttpTestingController;

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
      numeroCasa: '8651-2',
      pasaje: 'Pasaje 8651',
      direccion: 'Pasaje 8651, Casa 2',
      residente: {
        nombre: 'María González',
        rut: '23456789-0',
        email: 'maria.gonzalez@email.com',
        telefono: '+56923456789'
      },
      metrosCuadrados: 115,
      cantidadHabitantes: 3,
      activa: true
    },
    {
      id: 3,
      numeroCasa: '8707-1',
      pasaje: 'Pasaje 8707',
      direccion: 'Pasaje 8707, Casa 1',
      residente: {
        nombre: 'Carlos Rodríguez',
        rut: '34567890-1',
        email: 'carlos.rodriguez@email.com',
        telefono: '+56934567890'
      },
      metrosCuadrados: 130,
      cantidadHabitantes: 5,
      activa: false
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CasasService]
    });
    service = TestBed.inject(CasasService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verificar que no haya peticiones HTTP pendientes
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all casas from JSON', (done) => {
    service.getCasas().subscribe({
      next: (casas) => {
        expect(casas).toEqual(mockCasas);
        expect(casas.length).toBe(3);
        done();
      },
      error: done.fail
    });

    const req = httpMock.expectOne('/data/casas.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockCasas);
  });

  it('should get casa by ID', (done) => {
    service.getCasaById(1).subscribe({
      next: (casa) => {
        expect(casa).toBeDefined();
        expect(casa?.id).toBe(1);
        expect(casa?.numeroCasa).toBe('8651-1');
        done();
      },
      error: done.fail
    });

    const req = httpMock.expectOne('/data/casas.json');
    req.flush(mockCasas);
  });

  it('should return undefined for non-existent casa ID', (done) => {
    service.getCasaById(999).subscribe({
      next: (casa) => {
        expect(casa).toBeUndefined();
        done();
      },
      error: done.fail
    });

    const req = httpMock.expectOne('/data/casas.json');
    req.flush(mockCasas);
  });

  it('should filter casas by pasaje', (done) => {
    service.getCasasByPasaje('Pasaje 8651').subscribe({
      next: (casas) => {
        expect(casas.length).toBe(2);
        expect(casas.every(c => c.pasaje === 'Pasaje 8651')).toBe(true);
        done();
      },
      error: done.fail
    });

    const req = httpMock.expectOne('/data/casas.json');
    req.flush(mockCasas);
  });

  it('should get only active casas', (done) => {
    service.getCasasActivas().subscribe({
      next: (casas) => {
        expect(casas.length).toBe(2);
        expect(casas.every(c => c.activa === true)).toBe(true);
        done();
      },
      error: done.fail
    });

    const req = httpMock.expectOne('/data/casas.json');
    req.flush(mockCasas);
  });

  it('should calculate total metros cuadrados', (done) => {
    service.getTotalMetrosCuadrados().subscribe({
      next: (total) => {
        expect(total).toBe(365); // 120 + 115 + 130
        done();
      },
      error: done.fail
    });

    const req = httpMock.expectOne('/data/casas.json');
    req.flush(mockCasas);
  });

  it('should calculate total habitantes', (done) => {
    service.getTotalHabitantes().subscribe({
      next: (total) => {
        expect(total).toBe(12); // 4 + 3 + 5
        done();
      },
      error: done.fail
    });

    const req = httpMock.expectOne('/data/casas.json');
    req.flush(mockCasas);
  });

  it('should handle HTTP error gracefully', (done) => {
    service.getCasas().subscribe({
      next: () => done.fail('Should have failed'),
      error: (error) => {
        expect(error).toBeTruthy();
        done();
      }
    });

    const req = httpMock.expectOne('/data/casas.json');
    req.error(new ProgressEvent('Network error'), {
      status: 404,
      statusText: 'Not Found'
    });
  });
});
