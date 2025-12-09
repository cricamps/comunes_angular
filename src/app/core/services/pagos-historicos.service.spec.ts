import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PagosHistoricosService } from './pagos-historicos.service';
import { PagoHistorico } from '../../models/pago-historico.interface';

describe('PagosHistoricosService', () => {
  let service: PagosHistoricosService;
  let httpMock: HttpTestingController;

  const mockPagos: PagoHistorico[] = [
    {
      id: 1,
      casaId: 1,
      numeroCasa: '8651-1',
      mes: '11',
      anio: 2025,
      fechaPago: '2025-11-05',
      montoTotal: 95000,
      metodoPago: 'transferencia',
      estadoPago: 'pagado',
      detalleGastos: [
        { concepto: 'Agua', monto: 25000 },
        { concepto: 'Luz', monto: 35000 }
      ]
    },
    {
      id: 2,
      casaId: 2,
      numeroCasa: '8651-2',
      mes: '11',
      anio: 2025,
      fechaPago: '2025-11-10',
      montoTotal: 95000,
      metodoPago: 'efectivo',
      estadoPago: 'pagado',
      detalleGastos: [
        { concepto: 'Agua', monto: 25000 },
        { concepto: 'Luz', monto: 35000 }
      ]
    },
    {
      id: 3,
      casaId: 3,
      numeroCasa: '8707-1',
      mes: '11',
      anio: 2025,
      fechaPago: null,
      montoTotal: 95000,
      metodoPago: null,
      estadoPago: 'pendiente',
      detalleGastos: []
    },
    {
      id: 4,
      casaId: 1,
      numeroCasa: '8651-1',
      mes: '10',
      anio: 2025,
      fechaPago: '2025-10-03',
      montoTotal: 90000,
      metodoPago: 'transferencia',
      estadoPago: 'pagado',
      detalleGastos: []
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PagosHistoricosService]
    });
    service = TestBed.inject(PagosHistoricosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all pagos from JSON', (done) => {
    service.getPagosHistoricos().subscribe({
      next: (pagos) => {
        expect(pagos).toEqual(mockPagos);
        expect(pagos.length).toBe(4);
        done();
      },
      error: done.fail
    });

    const req = httpMock.expectOne('/data/pagos-historicos.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockPagos);
  });

  it('should get pago by ID', (done) => {
    service.getPagoById(1).subscribe({
      next: (pago) => {
        expect(pago).toBeDefined();
        expect(pago?.id).toBe(1);
        expect(pago?.casaId).toBe(1);
        done();
      },
      error: done.fail
    });

    const req = httpMock.expectOne('/data/pagos-historicos.json');
    req.flush(mockPagos);
  });

  it('should return undefined for non-existent pago ID', (done) => {
    service.getPagoById(999).subscribe({
      next: (pago) => {
        expect(pago).toBeUndefined();
        done();
      },
      error: done.fail
    });

    const req = httpMock.expectOne('/data/pagos-historicos.json');
    req.flush(mockPagos);
  });

  it('should filter pagos by casa ID', (done) => {
    service.getPagosByCasaId(1).subscribe({
      next: (pagos) => {
        expect(pagos.length).toBe(2);
        expect(pagos.every(p => p.casaId === 1)).toBe(true);
        done();
      },
      error: done.fail
    });

    const req = httpMock.expectOne('/data/pagos-historicos.json');
    req.flush(mockPagos);
  });

  it('should filter pagos by estado', (done) => {
    service.getPagosByEstado('pagado').subscribe({
      next: (pagos) => {
        expect(pagos.length).toBe(3);
        expect(pagos.every(p => p.estadoPago === 'pagado')).toBe(true);
        done();
      },
      error: done.fail
    });

    const req = httpMock.expectOne('/data/pagos-historicos.json');
    req.flush(mockPagos);
  });

  it('should filter pagos by periodo (mes y anio)', (done) => {
    service.getPagosByPeriodo('11', 2025).subscribe({
      next: (pagos) => {
        expect(pagos.length).toBe(3);
        expect(pagos.every(p => p.mes === '11' && p.anio === 2025)).toBe(true);
        done();
      },
      error: done.fail
    });

    const req = httpMock.expectOne('/data/pagos-historicos.json');
    req.flush(mockPagos);
  });

  it('should calculate total recaudado in periodo', (done) => {
    service.getTotalRecaudadoPeriodo('11', 2025).subscribe({
      next: (total) => {
        // Solo pagos con estado 'pagado' de noviembre 2025: 95000 + 95000 = 190000
        expect(total).toBe(190000);
        done();
      },
      error: done.fail
    });

    const req = httpMock.expectOne('/data/pagos-historicos.json');
    req.flush(mockPagos);
  });

  it('should get only pagos pendientes', (done) => {
    service.getPagosPendientes().subscribe({
      next: (pagos) => {
        expect(pagos.length).toBe(1);
        expect(pagos[0].estadoPago).toBe('pendiente');
        done();
      },
      error: done.fail
    });

    const req = httpMock.expectOne('/data/pagos-historicos.json');
    req.flush(mockPagos);
  });

  it('should calculate total deuda pendiente', (done) => {
    service.getTotalDeudaPendiente().subscribe({
      next: (total) => {
        expect(total).toBe(95000); // Solo el pago pendiente
        done();
      },
      error: done.fail
    });

    const req = httpMock.expectOne('/data/pagos-historicos.json');
    req.flush(mockPagos);
  });

  it('should get estadisticas for a specific casa', (done) => {
    service.getEstadisticasCasa(1).subscribe({
      next: (stats) => {
        expect(stats.cantidadPagos).toBe(2);
        expect(stats.totalPagado).toBe(185000); // 95000 + 90000
        expect(stats.cantidadPendientes).toBe(0);
        done();
      },
      error: done.fail
    });

    const req = httpMock.expectOne('/data/pagos-historicos.json');
    req.flush(mockPagos);
  });

  it('should handle HTTP error gracefully', (done) => {
    service.getPagosHistoricos().subscribe({
      next: () => done.fail('Should have failed'),
      error: (error) => {
        expect(error).toBeTruthy();
        done();
      }
    });

    const req = httpMock.expectOne('/data/pagos-historicos.json');
    req.error(new ProgressEvent('Network error'), {
      status: 404,
      statusText: 'Not Found'
    });
  });
});
