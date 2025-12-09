import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagoHistorico, EstadoPago } from '../../models/pago-historico.interface';

/**
 * Servicio para gestionar el historial de pagos
 * Consume datos desde archivos JSON
 */
@Injectable({
  providedIn: 'root'
})
export class PagosHistoricosService {
  private jsonUrl = '/data/pagos-historicos.json';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todos los pagos históricos desde el archivo JSON
   * @returns Observable con el array de pagos
   */
  getPagosHistoricos(): Observable<PagoHistorico[]> {
    return this.http.get<PagoHistorico[]>(this.jsonUrl);
  }

  /**
   * Obtiene un pago específico por su ID
   * @param id - ID del pago
   * @returns Observable con el pago encontrado o undefined
   */
  getPagoById(id: number): Observable<PagoHistorico | undefined> {
    return new Observable(observer => {
      this.http.get<PagoHistorico[]>(this.jsonUrl).subscribe({
        next: (pagos) => {
          const pago = pagos.find(p => p.id === id);
          observer.next(pago);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  /**
   * Obtiene todos los pagos de una casa específica
   * @param casaId - ID de la casa
   * @returns Observable con el array de pagos de la casa
   */
  getPagosByCasaId(casaId: number): Observable<PagoHistorico[]> {
    return new Observable(observer => {
      this.http.get<PagoHistorico[]>(this.jsonUrl).subscribe({
        next: (pagos) => {
          const pagosCasa = pagos.filter(p => p.casaId === casaId);
          observer.next(pagosCasa);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  /**
   * Obtiene los pagos por estado
   * @param estado - Estado del pago a filtrar
   * @returns Observable con el array de pagos con ese estado
   */
  getPagosByEstado(estado: EstadoPago): Observable<PagoHistorico[]> {
    return new Observable(observer => {
      this.http.get<PagoHistorico[]>(this.jsonUrl).subscribe({
        next: (pagos) => {
          const pagosFiltrados = pagos.filter(p => p.estadoPago === estado);
          observer.next(pagosFiltrados);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  /**
   * Obtiene los pagos de un mes y año específico
   * @param mes - Mes del pago
   * @param anio - Año del pago
   * @returns Observable con el array de pagos del periodo
   */
  getPagosByPeriodo(mes: string, anio: number): Observable<PagoHistorico[]> {
    return new Observable(observer => {
      this.http.get<PagoHistorico[]>(this.jsonUrl).subscribe({
        next: (pagos) => {
          const pagosPeriodo = pagos.filter(p => p.mes === mes && p.anio === anio);
          observer.next(pagosPeriodo);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  /**
   * Calcula el total recaudado en un periodo
   * @param mes - Mes del pago
   * @param anio - Año del pago
   * @returns Observable con el monto total recaudado
   */
  getTotalRecaudadoPeriodo(mes: string, anio: number): Observable<number> {
    return new Observable(observer => {
      this.http.get<PagoHistorico[]>(this.jsonUrl).subscribe({
        next: (pagos) => {
          const total = pagos
            .filter(p => p.mes === mes && p.anio === anio && p.estadoPago === 'pagado')
            .reduce((sum, pago) => sum + pago.montoTotal, 0);
          observer.next(total);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  /**
   * Obtiene los pagos pendientes
   * @returns Observable con el array de pagos pendientes
   */
  getPagosPendientes(): Observable<PagoHistorico[]> {
    return this.getPagosByEstado('pendiente');
  }

  /**
   * Calcula el monto total de deuda pendiente
   * @returns Observable con el monto total pendiente
   */
  getTotalDeudaPendiente(): Observable<number> {
    return new Observable(observer => {
      this.http.get<PagoHistorico[]>(this.jsonUrl).subscribe({
        next: (pagos) => {
          const total = pagos
            .filter(p => p.estadoPago === 'pendiente' || p.estadoPago === 'atrasado')
            .reduce((sum, pago) => sum + pago.montoTotal, 0);
          observer.next(total);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  /**
   * Obtiene estadísticas de pagos por casa
   * @param casaId - ID de la casa
   * @returns Observable con las estadísticas
   */
  getEstadisticasCasa(casaId: number): Observable<{
    totalPagado: number;
    totalPendiente: number;
    cantidadPagos: number;
    cantidadPendientes: number;
  }> {
    return new Observable(observer => {
      this.http.get<PagoHistorico[]>(this.jsonUrl).subscribe({
        next: (pagos) => {
          const pagosCasa = pagos.filter(p => p.casaId === casaId);
          const pagados = pagosCasa.filter(p => p.estadoPago === 'pagado');
          const pendientes = pagosCasa.filter(p => p.estadoPago === 'pendiente' || p.estadoPago === 'atrasado');
          
          const estadisticas = {
            totalPagado: pagados.reduce((sum, p) => sum + p.montoTotal, 0),
            totalPendiente: pendientes.reduce((sum, p) => sum + p.montoTotal, 0),
            cantidadPagos: pagados.length,
            cantidadPendientes: pendientes.length
          };
          
          observer.next(estadisticas);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }
}
