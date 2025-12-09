import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConceptoGasto, CategoriaGasto } from '../../models/concepto-gasto.interface';

/**
 * Servicio para gestionar los conceptos de gastos comunes
 * Consume datos desde archivos JSON
 */
@Injectable({
  providedIn: 'root'
})
export class ConceptosGastosService {
  private jsonUrl = '/data/conceptos-gastos.json';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todos los conceptos de gastos desde el archivo JSON
   * @returns Observable con el array de conceptos
   */
  getConceptosGastos(): Observable<ConceptoGasto[]> {
    return this.http.get<ConceptoGasto[]>(this.jsonUrl);
  }

  /**
   * Obtiene un concepto de gasto específico por su ID
   * @param id - ID del concepto
   * @returns Observable con el concepto encontrado o undefined
   */
  getConceptoById(id: number): Observable<ConceptoGasto | undefined> {
    return new Observable(observer => {
      this.http.get<ConceptoGasto[]>(this.jsonUrl).subscribe({
        next: (conceptos) => {
          const concepto = conceptos.find(c => c.id === id);
          observer.next(concepto);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  /**
   * Obtiene los conceptos activos
   * @returns Observable con el array de conceptos activos
   */
  getConceptosActivos(): Observable<ConceptoGasto[]> {
    return new Observable(observer => {
      this.http.get<ConceptoGasto[]>(this.jsonUrl).subscribe({
        next: (conceptos) => {
          const activos = conceptos.filter(c => c.activo);
          observer.next(activos);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  /**
   * Obtiene los conceptos por categoría
   * @param categoria - Categoría a filtrar
   * @returns Observable con el array de conceptos de la categoría
   */
  getConceptosByCategoria(categoria: CategoriaGasto): Observable<ConceptoGasto[]> {
    return new Observable(observer => {
      this.http.get<ConceptoGasto[]>(this.jsonUrl).subscribe({
        next: (conceptos) => {
          const filtrados = conceptos.filter(c => c.categoria === categoria);
          observer.next(filtrados);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  /**
   * Calcula el total de gastos mensuales considerando solo conceptos activos
   * @returns Observable con el monto total mensual
   */
  calcularTotalMensual(): Observable<number> {
    return new Observable(observer => {
      this.http.get<ConceptoGasto[]>(this.jsonUrl).subscribe({
        next: (conceptos) => {
          const total = conceptos
            .filter(c => c.activo)
            .reduce((sum, concepto) => sum + concepto.montoPorDefecto, 0);
          observer.next(total);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  /**
   * Obtiene las categorías únicas de gastos
   * @returns Observable con el array de categorías
   */
  getCategorias(): Observable<CategoriaGasto[]> {
    return new Observable(observer => {
      this.http.get<ConceptoGasto[]>(this.jsonUrl).subscribe({
        next: (conceptos) => {
          const categorias = [...new Set(conceptos.map(c => c.categoria))];
          observer.next(categorias);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }
}
