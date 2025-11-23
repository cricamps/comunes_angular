import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

interface Resumen {
  totalGastos: number;
  totalRecaudado: number;
  pendiente: number;
  balance: number;
}

interface Estadisticas {
  tasaPago: number;
  casasAlDia: number;
  totalResidentes: number;
}

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {
  reporteActual: string = '';
  mesActual: string = '';
  
  gastos: any[] = [];
  pagos: any[] = [];
  residentes: any[] = [];
  
  gastosMesActual: any[] = [];
  pagosMesActual: any[] = [];
  top5Gastos: any[] = [];
  
  resumen: Resumen = {
    totalGastos: 0,
    totalRecaudado: 0,
    pendiente: 0,
    balance: 0
  };
  
  estadisticas: Estadisticas = {
    tasaPago: 0,
    casasAlDia: 0,
    totalResidentes: 0
  };

  ngOnInit(): void {
    this.cargarDatos();
    this.calcularResumen();
    this.calcularEstadisticas();
    this.establecerMesActual();
  }

  cargarDatos(): void {
    // Cargar gastos
    const gastosStorage = localStorage.getItem('gastos');
    this.gastos = gastosStorage ? JSON.parse(gastosStorage) : [];
    
    // Cargar pagos
    const pagosStorage = localStorage.getItem('pagos');
    this.pagos = pagosStorage ? JSON.parse(pagosStorage) : [];
    
    // Cargar residentes
    const usuariosStorage = localStorage.getItem('usuarios');
    const usuarios = usuariosStorage ? JSON.parse(usuariosStorage) : [];
    this.residentes = usuarios.filter((u: any) => u.casa && u.pasaje);
  }

  establecerMesActual(): void {
    const ahora = new Date();
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    this.mesActual = `${meses[ahora.getMonth()]} ${ahora.getFullYear()}`;
  }

  calcularResumen(): void {
    const mesActual = new Date().toISOString().substring(0, 7); // YYYY-MM
    
    // Filtrar datos del mes actual
    this.gastosMesActual = this.gastos.filter(g => g.mes === mesActual);
    this.pagosMesActual = this.pagos.filter(p => p.mes === mesActual);
    
    // Calcular totales
    this.resumen.totalGastos = this.gastosMesActual.reduce((sum, g) => sum + g.monto, 0);
    this.resumen.totalRecaudado = this.pagosMesActual.reduce((sum, p) => sum + p.monto, 0);
    
    const montoPorCasa = Math.ceil(this.resumen.totalGastos / 13);
    const totalEsperado = montoPorCasa * 13;
    
    this.resumen.pendiente = totalEsperado - this.resumen.totalRecaudado;
    this.resumen.balance = this.resumen.totalRecaudado - this.resumen.totalGastos;
    
    // Top 5 gastos
    this.top5Gastos = [...this.gastosMesActual]
      .sort((a, b) => b.monto - a.monto)
      .slice(0, 5);
  }

  calcularEstadisticas(): void {
    // Total residentes
    this.estadisticas.totalResidentes = this.residentes.length;
    
    // Tasa de pago
    if (this.resumen.totalGastos > 0) {
      const montoPorCasa = Math.ceil(this.resumen.totalGastos / 13);
      const totalEsperado = montoPorCasa * 13;
      this.estadisticas.tasaPago = Math.round((this.resumen.totalRecaudado / totalEsperado) * 100);
    }
    
    // Casas al día (simulado - asumimos que si pagaron están al día)
    const casasQuePagaron = new Set(this.pagosMesActual.map(p => p.casa));
    this.estadisticas.casasAlDia = casasQuePagaron.size;
  }

  verReporte(tipo: string): void {
    this.reporteActual = tipo;
  }

  imprimirReporte(): void {
    window.print();
  }
}
