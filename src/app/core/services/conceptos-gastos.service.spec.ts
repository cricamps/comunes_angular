import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConceptosGastosService } from './conceptos-gastos.service';
import { ConceptoGasto } from '../../models/concepto-gasto.interface';

describe('ConceptosGastosService', () => {
  let service: ConceptosGastosService;
  let httpMock: HttpTestingController;

  const mockConceptos: ConceptoGasto[] = [
    {
      id: 1,
      nombre: 'Agua',
      descripcion: 'Consumo de agua potable',
      tipoCalculo: 'proporcional',
      montoPorDefecto: 25000,
      activo: true,
      categoria: 'servicios-basicos'
    },
    {
      id: 2,
      nombre: 'Luz',
      descripcion: 'Consumo de electricidad',
      tipoCalculo: 'proporcional',
      montoPorDefecto: 35000,
      activo: true,
      categoria: 'servicios-basicos'
    },
    {
      id: 3,
      nombre: 'Seguridad',
      descripcion: 'Servicio de guardia',
      tipoCalculo: 'fijo',
      montoPorDefecto: 15000,
      activo: true,
      categoria: 'seguros'
    },
    {
      id: 4,
      nombre: 'Jardinería',
      descripcion: 'Mantención de áreas verdes',
      tipoCalculo: 'fijo',
      montoPorDefecto: 10000,
      activo: false,
      categoria: 'mantenimiento'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConceptosGastosService]
    });
    service = TestBed.inject(ConceptosGastosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all conceptos from JSON', (done) => {
    service.getConceptosGastos().subscribe({
      next: (conceptos) => {
        expect(conceptos).toEqual(mockConceptos);
        expect(conceptos.length).toBe(4);
        done();
      },
      error: done.fail
    });

    const req = httpMock.expectOne('/data/conceptos-gastos.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockConceptos);
  });

  it('should get concepto by ID', (done) => {
    service.getConceptoById(1).subscribe({
      next: (concepto) => {
        expect(concepto).toBeDefined();
        expect(concepto?.id).toBe(1);
        expect(concepto?.nombre).toBe('Agua');
        done();
      },
      error: done.fail
    });

    const req = httpMock.expectOne('/data/conceptos-gastos.json');
    req.flush(mockConceptos);
  });

  it('should return undefined for non-existent concepto ID', (done) => {
    service.getConceptoById(999).subscribe({
      next: (concepto) => {
        expect(concepto).toBeUndefined();
        done();
      },
      error: done.fail
    });

    const req = httpMock.expectOne('/data/conceptos-gastos.json');
    req.flush(mockConceptos);
  });

  it('should get only active conceptos', (done) => {
    service.getConceptosActivos().subscribe({
      next: (conceptos) => {
        expect(conceptos.length).toBe(3);
        expect(conceptos.every(c => c.activo === true)).toBe(true);
        done();
      },
      error: done.fail
    });

    const req = httpMock.expectOne('/data/conceptos-gastos.json');
    req.flush(mockConceptos);
  });

  it('should filter conceptos by categoria', (done) => {
    service.getConceptosByCategoria('servicios-basicos').subscribe({
      next: (conceptos) => {
        expect(conceptos.length).toBe(2);
        expect(conceptos.every(c => c.categoria === 'servicios-basicos')).toBe(true);
        done();
      },
      error: done.fail
    });

    const req = httpMock.expectOne('/data/conceptos-gastos.json');
    req.flush(mockConceptos);
  });

  it('should calculate total mensual of active conceptos', (done) => {
    service.calcularTotalMensual().subscribe({
      next: (total) => {
        // Agua (25000) + Luz (35000) + Seguridad (15000) = 75000
        expect(total).toBe(75000);
        done();
      },
      error: done.fail
    });

    const req = httpMock.expectOne('/data/conceptos-gastos.json');
    req.flush(mockConceptos);
  });

  it('should get unique categorias', (done) => {
    service.getCategorias().subscribe({
      next: (categorias) => {
        expect(categorias.length).toBe(3);
        expect(categorias).toContain('servicios-basicos');
        expect(categorias).toContain('seguros');
        expect(categorias).toContain('mantenimiento');
        done();
      },
      error: done.fail
    });

    const req = httpMock.expectOne('/data/conceptos-gastos.json');
    req.flush(mockConceptos);
  });

  it('should handle HTTP error gracefully', (done) => {
    service.getConceptosGastos().subscribe({
      next: () => done.fail('Should have failed'),
      error: (error) => {
        expect(error).toBeTruthy();
        done();
      }
    });

    const req = httpMock.expectOne('/data/conceptos-gastos.json');
    req.error(new ProgressEvent('Network error'), {
      status: 500,
      statusText: 'Server Error'
    });
  });
});
