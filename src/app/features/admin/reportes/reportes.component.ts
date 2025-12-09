import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { Gasto } from '../../../models/gasto.interface';
import { Pago } from '../../../models/pago.interface';
import { Usuario } from '../../../models/usuario.interface';

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
  
  gastos: Gasto[] = [];
  pagos: Pago[] = [];
  residentes: Usuario[] = [];
  
  gastosActivos: Gasto[] = [];
  pagosMesActual: Pago[] = [];
  top5Gastos: Gasto[] = [];
  
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
    this.establecerMesActual();
    this.cargarDatos();
    this.calcularResumen();
    this.calcularEstadisticas();
  }

  establecerMesActual(): void {
    const ahora = new Date();
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    this.mesActual = `${meses[ahora.getMonth()]} ${ahora.getFullYear()}`;
  }

  cargarDatos(): void {
    // Cargar gastos desde localStorage
    const gastosStorage = localStorage.getItem('gastos');
    if (gastosStorage) {
      this.gastos = JSON.parse(gastosStorage);
    } else {
      // Si no hay gastos, inicializar con datos de ejemplo
      this.inicializarGastosEjemplo();
    }
    
    // Cargar pagos desde localStorage
    const pagosStorage = localStorage.getItem('pagos');
    if (pagosStorage) {
      this.pagos = JSON.parse(pagosStorage);
    } else {
      // Si no hay pagos, inicializar con datos de ejemplo
      this.inicializarPagosEjemplo();
    }
    
    // Cargar residentes desde localStorage
    const usuariosStorage = localStorage.getItem('usuarios');
    if (usuariosStorage) {
      const usuarios: Usuario[] = JSON.parse(usuariosStorage);
      this.residentes = usuarios.filter(u => u.casa && u.pasaje);
    } else {
      this.residentes = [];
    }

    console.log('📊 Datos cargados:', {
      gastos: this.gastos.length,
      pagos: this.pagos.length,
      residentes: this.residentes.length
    });
  }

  calcularResumen(): void {
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth();
    const añoActual = fechaActual.getFullYear();
    
    // Filtrar gastos activos (no por mes, sino por estado)
    this.gastosActivos = this.gastos.filter(g => 
      g.estado === 'Activo' || g.estado === 'aprobado'
    );
    
    // Filtrar pagos del mes actual
    this.pagosMesActual = this.pagos.filter(p => {
      const fechaPago = new Date(p.fecha);
      return fechaPago.getMonth() === mesActual && 
             fechaPago.getFullYear() === añoActual;
    });
    
    // Calcular totales
    this.resumen.totalGastos = this.gastosActivos.reduce((sum, g) => sum + g.monto, 0);
    this.resumen.totalRecaudado = this.pagosMesActual.reduce((sum, p) => sum + p.monto, 0);
    
    // Calcular pendiente
    const montoPorCasa = Math.ceil(this.resumen.totalGastos / 13);
    const totalEsperado = montoPorCasa * 13;
    this.resumen.pendiente = totalEsperado - this.resumen.totalRecaudado;
    
    // Calcular balance
    this.resumen.balance = this.resumen.totalRecaudado - this.resumen.totalGastos;
    
    // Top 5 gastos más altos
    this.top5Gastos = [...this.gastosActivos]
      .sort((a, b) => b.monto - a.monto)
      .slice(0, 5);

    console.log('💰 Resumen calculado:', this.resumen);
    console.log('📈 Top 5 Gastos:', this.top5Gastos);
  }

  calcularEstadisticas(): void {
    // Total residentes
    this.estadisticas.totalResidentes = this.residentes.length || 13;
    
    // Tasa de pago
    if (this.resumen.totalGastos > 0) {
      const montoPorCasa = Math.ceil(this.resumen.totalGastos / 13);
      const totalEsperado = montoPorCasa * 13;
      if (totalEsperado > 0) {
        this.estadisticas.tasaPago = Math.round((this.resumen.totalRecaudado / totalEsperado) * 100);
      }
    }
    
    // Casas al día (contamos cuántas casas diferentes pagaron)
    const casasQuePagaron = new Set<string>();
    this.pagosMesActual.forEach(p => {
      const identificador = `${p.pasaje}-${p.casa}`;
      casasQuePagaron.add(identificador);
    });
    this.estadisticas.casasAlDia = casasQuePagaron.size;

    console.log('📊 Estadísticas calculadas:', this.estadisticas);
  }

  verReporte(tipo: string): void {
    this.reporteActual = tipo;
    console.log('📄 Ver reporte:', tipo);
  }

  imprimirReporte(): void {
    window.print();
  }

  /**
   * Inicializa datos de ejemplo para gastos si no existen
   */
  private inicializarGastosEjemplo(): void {
    this.gastos = [
      {
        id: 1,
        concepto: 'Mantención Áreas Verdes',
        descripcion: 'Poda de árboles y mantención de jardines',
        monto: 350000,
        fecha: new Date(2025, 10, 1).toISOString(),
        estado: 'Activo',
        categoria: 'Mantención'
      },
      {
        id: 2,
        concepto: 'Cuenta de Agua',
        descripcion: 'Consumo de agua mes actual',
        monto: 125000,
        fecha: new Date(2025, 10, 5).toISOString(),
        estado: 'Activo',
        categoria: 'Servicios Básicos'
      },
      {
        id: 3,
        concepto: 'Cuenta de Luz',
        descripcion: 'Consumo de electricidad áreas comunes',
        monto: 85000,
        fecha: new Date(2025, 10, 5).toISOString(),
        estado: 'Activo',
        categoria: 'Servicios Básicos'
      },
      {
        id: 4,
        concepto: 'Servicio de Seguridad',
        descripcion: 'Pago mensual servicio de guardia',
        monto: 450000,
        fecha: new Date(2025, 10, 1).toISOString(),
        estado: 'Activo',
        categoria: 'Seguridad'
      },
      {
        id: 5,
        concepto: 'Mantención Alumbrado',
        descripcion: 'Reparación de farolas exteriores',
        monto: 180000,
        fecha: new Date(2025, 9, 28).toISOString(),
        estado: 'Pagado',
        categoria: 'Mantención'
      }
    ];
    localStorage.setItem('gastos', JSON.stringify(this.gastos));
    console.log('✨ Gastos de ejemplo inicializados');
  }

  /**
   * Inicializa datos de ejemplo para pagos si no existen
   */
  private inicializarPagosEjemplo(): void {
    this.pagos = [
      {
        id: 1,
        nombreResidente: 'Juan Pérez',
        email: 'juan.perez@email.com',
        pasaje: '8651',
        casa: 'A',
        monto: 95000,
        fecha: new Date(2025, 10, 2).toISOString(),
        estado: 'confirmado',
        metodoPago: 'Transferencia'
      },
      {
        id: 2,
        nombreResidente: 'María González',
        email: 'maria.gonzalez@email.com',
        pasaje: '8651',
        casa: 'B',
        monto: 95000,
        fecha: new Date(2025, 10, 3).toISOString(),
        estado: 'confirmado',
        metodoPago: 'Efectivo'
      },
      {
        id: 3,
        nombreResidente: 'Carlos Rojas',
        email: 'carlos.rojas@email.com',
        pasaje: '8707',
        casa: 'C',
        monto: 95000,
        fecha: new Date(2025, 10, 4).toISOString(),
        estado: 'confirmado',
        metodoPago: 'Transferencia'
      },
      {
        id: 4,
        nombreResidente: 'Ana Martínez',
        email: 'ana.martinez@email.com',
        pasaje: '8651',
        casa: 'D',
        monto: 95000,
        fecha: new Date(2025, 10, 5).toISOString(),
        estado: 'confirmado',
        metodoPago: 'Transferencia'
      }
    ];
    localStorage.setItem('pagos', JSON.stringify(this.pagos));
    console.log('✨ Pagos de ejemplo inicializados');
  }

  /**
   * Obtiene la clase CSS para el estado de un gasto
   */
  getEstadoClase(estado: string): string {
    const clases: { [key: string]: string } = {
      'Activo': 'badge bg-success',
      'Pendiente': 'badge bg-warning',
      'Pagado': 'badge bg-info',
      'Vencido': 'badge bg-danger'
    };
    return clases[estado] || 'badge bg-secondary';
  }

  /**
   * Obtiene la clase CSS para el balance
   */
  getBalanceClase(): string {
    if (this.resumen.balance > 0) return 'text-success';
    if (this.resumen.balance < 0) return 'text-danger';
    return 'text-muted';
  }
}
