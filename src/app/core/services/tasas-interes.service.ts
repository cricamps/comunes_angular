import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TasaInteres } from '../../models/tasa-interes.interface';

/**
 * Servicio para consumir JSON externo desde GitHub Pages
 * FORMA 2: JSON Externo
 */
@Injectable({
  providedIn: 'root'
})
export class TasasInteresService {
  // IMPORTANTE: Cambiar por tu URL de GitHub Pages
  private jsonUrl = 'https://cricamps.github.io/api-gastos-comunes/tasas-interes.json';
  
  // URL de respaldo (simulación)
  private jsonUrlBackup = '/data/tasas-interes-backup.json';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todas las tasas de interés desde GitHub Pages
   * @returns Observable con array de tasas
   */
  getTasasInteres(): Observable<TasaInteres[]> {
    return this.http.get<TasaInteres[]>(this.jsonUrl);
  }

  /**
   * Obtiene tasas vigentes
   */
  getTasasVigentes(): Observable<TasaInteres[]> {
    return this.getTasasInteres().pipe(
      map(tasas => tasas.filter(t => t.vigente))
    );
  }

  /**
   * Obtiene tasas por tipo de crédito
   */
  getTasasByTipo(tipo: string): Observable<TasaInteres[]> {
    return this.getTasasInteres().pipe(
      map(tasas => tasas.filter(t => t.tipoCredito.toLowerCase() === tipo.toLowerCase()))
    );
  }

  /**
   * Obtiene la tasa más baja vigente
   */
  getTasaMasBaja(): Observable<TasaInteres | undefined> {
    return this.getTasasVigentes().pipe(
      map(tasas => {
        if (tasas.length === 0) return undefined;
        return tasas.reduce((min, tasa) => 
          tasa.tasaAnual < min.tasaAnual ? tasa : min
        );
      })
    );
  }

  /**
   * Obtiene tasas por entidad bancaria
   */
  getTasasByEntidad(entidad: string): Observable<TasaInteres[]> {
    return this.getTasasInteres().pipe(
      map(tasas => tasas.filter(t => 
        t.entidad.toLowerCase().includes(entidad.toLowerCase())
      ))
    );
  }
}
