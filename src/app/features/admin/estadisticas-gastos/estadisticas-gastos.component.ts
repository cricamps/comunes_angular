import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConceptosGastosService } from '../../../core/services/conceptos-gastos.service';
import { PagosHistoricosService } from '../../../core/services/pagos-historicos.service';
import { CasasService } from '../../../core/services/casas.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ConceptoGasto } from '../../../models/concepto-gasto.interface';
import { PagoHistorico } from '../../../models/pago-historico.interface';
import { forkJoin } from 'rxjs';

/**
 * Componente para mostrar estadísticas de gastos de la comunidad
 * Consume datos desde múltiples servicios que leen archivos JSON
 */
@Component({
  selector: 'app-estadisticas-gastos',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './estadisticas-gastos.component.html',
  styleUrl: './estadisticas-gastos.component.scss'
})
export class EstadisticasGastosComponent implements OnInit {
  // Datos de conceptos
  conceptosGastos: ConceptoGasto[] = [];
  conceptosActivos: ConceptoGasto[] = [];
  totalMensualConceptos: number = 0;
  
  // Datos de pagos históricos
  pagosHistoricos: PagoHistorico[] = [];
  pagosPendientes: PagoHistorico[] = [];
  totalRecaudado: number = 0;
  totalPendiente: number = 0;
  
  // Estadísticas por categoría
  gastosPorCategoria: { [key: string]: number } = {};
  
  // Datos de casas
  totalCasas: number = 0;
  totalHabitantes: number = 0;
  
  // Estado de carga
  cargando: boolean = true;
  error: string = '';

  constructor(
    private conceptosService: ConceptosGastosService,
    private pagosService: PagosHistoricosService,
    private casasService: CasasService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  /**
   * Carga todos los datos necesarios desde los servicios JSON
   */
  cargarDatos(): void {
    this.cargando = true;
    
    // Usamos forkJoin para hacer todas las peticiones en paralelo
    forkJoin({
      conceptos: this.conceptosService.getConceptosGastos(),
      conceptosActivos: this.conceptosService.getConceptosActivos(),
      totalMensual: this.conceptosService.calcularTotalMensual(),
      pagosHistoricos: this.pagosService.getPagosHistoricos(),
      pagosPendientes: this.pagosService.getPagosPendientes(),
      totalDeuda: this.pagosService.getTotalDeudaPendiente(),
      casas: this.casasService.getCasas(),
      totalHabitantes: this.casasService.getTotalHabitantes()
    }).subscribe({
      next: (resultados) => {
        this.conceptosGastos = resultados.conceptos;
        this.conceptosActivos = resultados.conceptosActivos;
        this.totalMensualConceptos = resultados.totalMensual;
        this.pagosHistoricos = resultados.pagosHistoricos;
        this.pagosPendientes = resultados.pagosPendientes;
        this.totalPendiente = resultados.totalDeuda;
        this.totalCasas = resultados.casas.length;
        this.totalHabitantes = resultados.totalHabitantes;
        
        // Calcular total recaudado (solo pagos con estado 'pagado')
        this.totalRecaudado = this.pagosHistoricos
          .filter(p => p.estadoPago === 'pagado')
          .reduce((sum, pago) => sum + pago.montoTotal, 0);
        
        // Calcular gastos por categoría
        this.calcularGastosPorCategoria();
        
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar los datos:', error);
        this.error = 'No se pudieron cargar las estadísticas. Por favor, intente nuevamente.';
        this.cargando = false;
      }
    });
  }

  /**
   * Calcula el total de gastos por categoría
   */
  calcularGastosPorCategoria(): void {
    this.gastosPorCategoria = {};
    
    this.conceptosActivos.forEach(concepto => {
      const categoria = this.traducirCategoria(concepto.categoria);
      if (!this.gastosPorCategoria[categoria]) {
        this.gastosPorCategoria[categoria] = 0;
      }
      this.gastosPorCategoria[categoria] += concepto.montoPorDefecto;
    });
  }

  /**
   * Traduce las categorías a español legible
   */
  traducirCategoria(categoria: string): string {
    const traducciones: { [key: string]: string } = {
      'servicios-basicos': 'Servicios Básicos',
      'mantenimiento': 'Mantenimiento',
      'seguros': 'Seguros',
      'administracion': 'Administración',
      'servicios-adicionales': 'Servicios Adicionales'
    };
    return traducciones[categoria] || categoria;
  }

  /**
   * Obtiene las categorías como array para iteración
   */
  getCategoriasArray(): string[] {
    return Object.keys(this.gastosPorCategoria);
  }

  /**
   * Calcula el porcentaje de una categoría respecto al total
   */
  getPorcentajeCategoria(categoria: string): number {
    if (this.totalMensualConceptos === 0) return 0;
    return (this.gastosPorCategoria[categoria] / this.totalMensualConceptos) * 100;
  }

  /**
   * Calcula el porcentaje de pagos completados
   */
  getPorcentajePagos(): number {
    const totalPagos = this.pagosHistoricos.length;
    if (totalPagos === 0) return 0;
    const pagosPagados = this.pagosHistoricos.filter(p => p.estadoPago === 'pagado').length;
    return (pagosPagados / totalPagos) * 100;
  }

  /**
   * Calcula el promedio de gasto por casa
   */
  getPromedioPorCasa(): number {
    if (this.totalCasas === 0) return 0;
    return this.totalMensualConceptos;
  }

  /**
   * Calcula el promedio de gasto por habitante
   */
  getPromedioPorHabitante(): number {
    if (this.totalHabitantes === 0) return 0;
    return this.totalMensualConceptos / this.totalHabitantes;
  }

  /**
   * Obtiene la clase de color para el badge según el porcentaje
   */
  getBadgeClass(porcentaje: number): string {
    if (porcentaje >= 80) return 'bg-success';
    if (porcentaje >= 50) return 'bg-warning';
    return 'bg-danger';
  }
}
