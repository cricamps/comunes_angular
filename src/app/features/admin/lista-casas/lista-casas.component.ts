import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CasasService } from '../../../core/services/casas.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { Casa } from '../../../models/casa.interface';

/**
 * Componente para mostrar la lista de casas de la comunidad
 * Consume datos desde el servicio CasasService que lee un JSON
 */
@Component({
  selector: 'app-lista-casas',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './lista-casas.component.html',
  styleUrl: './lista-casas.component.scss'
})
export class ListaCasasComponent implements OnInit {
  casas: Casa[] = [];
  casasPasaje8651: Casa[] = [];
  casasPasaje8707: Casa[] = [];
  totalMetrosCuadrados: number = 0;
  totalHabitantes: number = 0;
  cargando: boolean = true;
  error: string = '';

  constructor(private casasService: CasasService) {}

  ngOnInit(): void {
    this.cargarCasas();
    this.cargarEstadisticas();
  }

  /**
   * Carga todas las casas desde el servicio
   */
  cargarCasas(): void {
    this.cargando = true;
    this.casasService.getCasas().subscribe({
      next: (casas) => {
        this.casas = casas;
        this.casasPasaje8651 = casas.filter(c => c.pasaje === 'Pasaje 8651');
        this.casasPasaje8707 = casas.filter(c => c.pasaje === 'Pasaje 8707');
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar las casas:', error);
        this.error = 'No se pudieron cargar las casas. Por favor, intente nuevamente.';
        this.cargando = false;
      }
    });
  }

  /**
   * Carga las estadísticas de la comunidad
   */
  cargarEstadisticas(): void {
    this.casasService.getTotalMetrosCuadrados().subscribe({
      next: (total) => this.totalMetrosCuadrados = total,
      error: (error) => console.error('Error al cargar metros cuadrados:', error)
    });

    this.casasService.getTotalHabitantes().subscribe({
      next: (total) => this.totalHabitantes = total,
      error: (error) => console.error('Error al cargar habitantes:', error)
    });
  }

  /**
   * Obtiene la clase CSS según el estado de la casa
   */
  getEstadoClase(activa: boolean): string {
    return activa ? 'badge bg-success' : 'badge bg-secondary';
  }

  /**
   * Obtiene el texto del estado
   */
  getEstadoTexto(activa: boolean): string {
    return activa ? 'Activa' : 'Inactiva';
  }
}
