import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-detalle-gasto',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './detalle-gasto.component.html',
  styleUrl: './detalle-gasto.component.scss'
})
export class DetalleGastoComponent implements OnInit {
  gasto: any = null;

  constructor(private router: Router) {
    // RECIBIR DATOS DEL GASTO DESDE NAVEGACIÓN
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.gasto = navigation.extras.state['gasto'];
      console.log('Gasto recibido:', this.gasto);
    }
  }

  ngOnInit(): void {
    // Si no hay datos, redirigir a la lista de gastos
    if (!this.gasto) {
      console.warn('No se recibieron datos del gasto, redirigiendo...');
      this.router.navigate(['/admin/gestionar-gastos']);
    }
  }

  volver(): void {
    this.router.navigate(['/admin/gestionar-gastos']);
  }

  /**
   * Calcular monto por casa
   */
  calcularMontoPorCasa(): number {
    if (!this.gasto) return 0;
    const totalCasas = 13; // 6 + 7 casas
    return Math.round(this.gasto.monto / totalCasas);
  }

  /**
   * Obtener clase CSS según estado
   */
  obtenerClaseEstado(): string {
    if (!this.gasto) return '';
    
    switch(this.gasto.estado) {
      case 'aprobado':
        return 'bg-success';
      case 'pendiente':
        return 'bg-warning';
      case 'rechazado':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  /**
   * Obtener icono según categoría
   */
  obtenerIconoCategoria(): string {
    if (!this.gasto) return 'bi-receipt';
    
    const iconos: { [key: string]: string } = {
      'Jardinería': 'bi-tree',
      'Servicios Básicos': 'bi-lightning',
      'Seguridad': 'bi-shield-check',
      'Limpieza': 'bi-spray',
      'Mantención': 'bi-tools'
    };
    
    return iconos[this.gasto.categoria] || 'bi-receipt';
  }
}
