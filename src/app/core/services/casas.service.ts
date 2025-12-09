import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Casa } from '../../models/casa.interface';

/**
 * Servicio para gestionar las casas de la comunidad
 * Consume datos desde archivos JSON
 */
@Injectable({
  providedIn: 'root'
})
export class CasasService {
  private jsonUrl = '/data/casas.json';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todas las casas desde el archivo JSON
   * @returns Observable con el array de casas
   */
  getCasas(): Observable<Casa[]> {
    return this.http.get<Casa[]>(this.jsonUrl);
  }

  /**
   * Obtiene una casa específica por su ID
   * @param id - ID de la casa
   * @returns Observable con la casa encontrada o undefined
   */
  getCasaById(id: number): Observable<Casa | undefined> {
    return new Observable(observer => {
      this.http.get<Casa[]>(this.jsonUrl).subscribe({
        next: (casas) => {
          const casa = casas.find(c => c.id === id);
          observer.next(casa);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  /**
   * Obtiene todas las casas de un pasaje específico
   * @param pasaje - Nombre del pasaje
   * @returns Observable con el array de casas del pasaje
   */
  getCasasByPasaje(pasaje: string): Observable<Casa[]> {
    return new Observable(observer => {
      this.http.get<Casa[]>(this.jsonUrl).subscribe({
        next: (casas) => {
          const casasFiltradas = casas.filter(c => c.pasaje === pasaje);
          observer.next(casasFiltradas);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  /**
   * Obtiene las casas activas
   * @returns Observable con el array de casas activas
   */
  getCasasActivas(): Observable<Casa[]> {
    return new Observable(observer => {
      this.http.get<Casa[]>(this.jsonUrl).subscribe({
        next: (casas) => {
          const casasActivas = casas.filter(c => c.activa);
          observer.next(casasActivas);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  /**
   * Calcula el total de metros cuadrados de la comunidad
   * @returns Observable con el total de metros cuadrados
   */
  getTotalMetrosCuadrados(): Observable<number> {
    return new Observable(observer => {
      this.http.get<Casa[]>(this.jsonUrl).subscribe({
        next: (casas) => {
          const total = casas.reduce((sum, casa) => sum + casa.metrosCuadrados, 0);
          observer.next(total);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  /**
   * Calcula el total de habitantes de la comunidad
   * @returns Observable con el total de habitantes
   */
  getTotalHabitantes(): Observable<number> {
    return new Observable(observer => {
      this.http.get<Casa[]>(this.jsonUrl).subscribe({
        next: (casas) => {
          const total = casas.reduce((sum, casa) => sum + casa.cantidadHabitantes, 0);
          observer.next(total);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }
}
