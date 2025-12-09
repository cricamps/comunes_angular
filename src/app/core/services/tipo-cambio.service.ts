import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError, of } from 'rxjs';
import { TipoCambio, TipoCambioSimple } from '../../models/tipo-cambio.interface';

/**
 * Servicio para consumir API externa real
 * FORMA 3: API Real de Internet
 */
@Injectable({
  providedIn: 'root'
})
export class TipoCambioService {
  // API pública gratuita de tipo de cambio
  private apiUrl = 'https://api.exchangerate-api.com/v4/latest/USD';
  
  // API alternativa (si la primera falla)
  private apiUrlBackup = 'https://open.er-api.com/v6/latest/USD';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene el tipo de cambio actual desde API externa
   * @returns Observable con datos de tipo de cambio
   */
  getTipoCambio(): Observable<TipoCambio> {
    return this.http.get<TipoCambio>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener tipo de cambio:', error);
        // Intentar con API de respaldo
        return this.http.get<TipoCambio>(this.apiUrlBackup);
      })
    );
  }

  /**
   * Obtiene el valor del dólar en pesos chilenos
   */
  getDolarCLP(): Observable<number> {
    return this.getTipoCambio().pipe(
      map(data => data.rates.CLP)
    );
  }

  /**
   * Obtiene el valor del euro en pesos chilenos
   */
  getEuroCLP(): Observable<number> {
    return this.getTipoCambio().pipe(
      map(data => {
        const usdToEur = data.rates.EUR;
        const usdToClp = data.rates.CLP;
        // EUR a CLP = (CLP / EUR)
        return usdToClp / usdToEur;
      })
    );
  }

  /**
   * Convierte un monto en USD a CLP
   */
  convertirUSDaCLP(montoUSD: number): Observable<number> {
    return this.getDolarCLP().pipe(
      map(tasaCLP => montoUSD * tasaCLP)
    );
  }

  /**
   * Obtiene resumen de principales monedas
   */
  getResumenMonedas(): Observable<TipoCambioSimple[]> {
    return this.getTipoCambio().pipe(
      map(data => {
        const monedas: TipoCambioSimple[] = [];
        
        // Dólar a Peso Chileno
        monedas.push({
          moneda: 'USD',
          valor: data.rates.CLP,
          fecha: data.date
        });

        // Euro a Peso Chileno (calculado)
        const eurToClp = data.rates.CLP / data.rates.EUR;
        monedas.push({
          moneda: 'EUR',
          valor: eurToClp,
          fecha: data.date
        });

        return monedas;
      })
    );
  }

  /**
   * Obtiene la fecha de actualización
   */
  getFechaActualizacion(): Observable<string> {
    return this.getTipoCambio().pipe(
      map(data => data.date)
    );
  }
}
