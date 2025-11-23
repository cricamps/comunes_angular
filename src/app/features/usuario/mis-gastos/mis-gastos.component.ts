import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { AuthService } from '../../../core/services/auth.service';
import { Gasto } from '../../../models/gasto.interface';

@Component({
  selector: 'app-mis-gastos',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './mis-gastos.component.html',
  styleUrl: './mis-gastos.component.scss'
})
export class MisGastosComponent implements OnInit {
  gastos: Gasto[] = [];
  totalGastos: number = 0;
  miParte: number = 0;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.cargarGastos();
  }

  cargarGastos(): void {
    const gastosStr = localStorage.getItem('gastos');
    this.gastos = gastosStr ? JSON.parse(gastosStr) : [];
    
    // Filtrar solo gastos activos
    this.gastos = this.gastos.filter(g => g.estado === 'Activo');
    
    // Calcular totales
    this.totalGastos = this.gastos.reduce((sum, g) => sum + g.monto, 0);
    this.miParte = Math.round(this.totalGastos / 13);
  }

  obtenerClaseEstado(estado: string): string {
    const clases: { [key: string]: string } = {
      'Activo': 'bg-success',
      'Pendiente': 'bg-warning',
      'Pagado': 'bg-info',
      'Vencido': 'bg-danger'
    };
    return clases[estado] || 'bg-secondary';
  }
}
