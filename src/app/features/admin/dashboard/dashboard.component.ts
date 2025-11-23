import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { Gasto } from '../../../models/gasto.interface';
import { Pago } from '../../../models/pago.interface';
import { Usuario } from '../../../models/usuario.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  // Información personal
  miCasa: string = '-';
  miDeuda: number = 0;
  ultimoPago: string = '-';
  estadoPago: string = '-';
  estadoPagoClass: string = '';

  // Información administrativa
  esAdmin: boolean = false;
  fechaActual: string = '';
  totalResidentes: number = 0;
  gastosMes: number = 0;
  pagosPendientes: number = 0;
  pagosRealizados: number = 0;

  // Tablas
  gastosRecientes: Gasto[] = [];
  pagosRecientes: Pago[] = [];

  // Distribución por pasaje
  residentesPasaje8651: number = 0;
  residentesPasaje8707: number = 0;
  porcentajePasaje8651: number = 0;
  porcentajePasaje8707: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('\n============================================');
    console.log('     DASHBOARD CARGADO - INICIO');
    console.log('============================================\n');

    // Verificar sesión
    const usuario = this.authService.getCurrentUser();
    if (!usuario) {
      this.router.navigate(['/login']);
      return;
    }

    // Verificar si es administrador
    this.esAdmin = this.authService.isAdmin();
    console.log('¿Es Admin?:', this.esAdmin);

    // Mostrar fecha actual
    this.mostrarFechaActual();

    // Cargar información personal (todos los usuarios)
    this.cargarMiInformacion();

    // Si es admin, cargar estadísticas
    if (this.esAdmin) {
      console.log('\n👑 MODO ADMINISTRADOR ACTIVADO');
      this.cargarEstadisticas();
      this.cargarGastosRecientes();
      this.cargarPagosRecientes();
      this.cargarDistribucionPasajes();
      this.inicializarDatosPrueba();
    } else {
      console.log('\n👤 MODO RESIDENTE ACTIVADO');
    }

    console.log('============================================');
    console.log('     DASHBOARD CARGADO - FIN');
    console.log('============================================\n');
  }

  // ===================================
  // INFORMACIÓN PERSONAL (TODOS)
  // ===================================

  cargarMiInformacion(): void {
    const usuario = this.authService.getCurrentUser();
    if (!usuario) return;

    // Mostrar mi casa
    this.miCasa = `Pasaje ${usuario.pasaje} - Casa ${usuario.casa}`;

    // Calcular mi deuda
    const gastos = this.obtenerGastos();
    const gastosAprobados = gastos.filter(g => g.estado === 'Activo' || g.estado === 'aprobado');
    const totalGastos = gastosAprobados.reduce((sum, g) => sum + g.monto, 0);
    this.miDeuda = Math.round(totalGastos / 13);

    // Verificar último pago
    const pagos = this.obtenerPagos();
    const misPagos = pagos.filter(p => 
      p.email === usuario.email || 
      (p.pasaje === usuario.pasaje && p.casa === usuario.casa)
    );

    if (misPagos.length > 0) {
      const ultimoPago = misPagos[misPagos.length - 1];
      const fecha = new Date(ultimoPago.fecha);
      this.ultimoPago = fecha.toLocaleDateString('es-CL');
      this.estadoPago = 'Al día';
      this.estadoPagoClass = 'text-success';
    } else {
      this.ultimoPago = 'Sin pagos';
      this.estadoPago = 'Pendiente';
      this.estadoPagoClass = 'text-warning';
    }
  }

  // ===================================
  // FUNCIONES ADMINISTRATIVAS
  // ===================================

  mostrarFechaActual(): void {
    const fecha = new Date();
    const opciones: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    this.fechaActual = fecha.toLocaleDateString('es-CL', opciones);
  }

  cargarEstadisticas(): void {
    const usuarios = this.obtenerUsuarios();
    const gastos = this.obtenerGastos();
    const pagos = this.obtenerPagos();

    // Filtrar solo residentes (no administradores)
    const residentes = usuarios.filter(u => u.casa);
    this.totalResidentes = residentes.length;

    // Gastos del mes actual
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth();
    const añoActual = fechaActual.getFullYear();

    const gastosMes = gastos.filter(g => {
      const fechaGasto = new Date(g.fecha);
      return fechaGasto.getMonth() === mesActual && fechaGasto.getFullYear() === añoActual;
    });

    this.gastosMes = gastosMes.reduce((sum, g) => sum + g.monto, 0);

    // Calcular pagos pendientes y realizados
    const totalCasas = 13;
    const pagosMesActual = pagos.filter(p => {
      const fechaPago = new Date(p.fecha);
      return fechaPago.getMonth() === mesActual && fechaPago.getFullYear() === añoActual;
    }).length;

    this.pagosPendientes = gastosMes.length > 0 ? totalCasas - pagosMesActual : 0;
    this.pagosRealizados = pagosMesActual;
  }

  cargarGastosRecientes(): void {
    const gastos = this.obtenerGastos();

    if (gastos.length === 0) {
      this.gastosRecientes = [];
      return;
    }

    // Ordenar por fecha descendente y tomar los últimos 5
    this.gastosRecientes = gastos
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, 5);
  }

  cargarPagosRecientes(): void {
    const pagos = this.obtenerPagos();
    const usuarios = this.obtenerUsuarios();

    if (pagos.length === 0) {
      this.pagosRecientes = [];
      return;
    }

    // Ordenar por fecha descendente y tomar los últimos 5
    const pagosOrdenados = pagos
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, 5);

    // Agregar nombre del residente a cada pago
    this.pagosRecientes = pagosOrdenados.map(pago => {
      let nombreResidente = 'Residente';

      if (pago.nombreResidente) {
        nombreResidente = pago.nombreResidente;
      } else if (pago.email) {
        const usuario = usuarios.find(u => u.email === pago.email);
        if (usuario?.nombre) {
          nombreResidente = usuario.nombre;
        }
      } else if (pago.pasaje && pago.casa) {
        const usuario = usuarios.find(u => 
          u.pasaje === pago.pasaje && u.casa === pago.casa
        );
        if (usuario?.nombre) {
          nombreResidente = usuario.nombre;
        }
      }

      return {
        ...pago,
        nombreResidente
      };
    });
  }

  cargarDistribucionPasajes(): void {
    const usuarios = this.obtenerUsuarios();
    const residentes = usuarios.filter(u => u.casa);

    // Contar residentes por pasaje
    this.residentesPasaje8651 = residentes.filter(r => r.pasaje === '8651').length;
    this.residentesPasaje8707 = residentes.filter(r => r.pasaje === '8707').length;
    const totalResidentes = residentes.length;

    // Calcular porcentajes
    this.porcentajePasaje8651 = totalResidentes > 0 
      ? Math.round((this.residentesPasaje8651 / totalResidentes) * 100) 
      : 0;
    this.porcentajePasaje8707 = totalResidentes > 0 
      ? Math.round((this.residentesPasaje8707 / totalResidentes) * 100) 
      : 0;
  }

  // ===================================
  // NAVEGACIÓN
  // ===================================

  irAPagar(): void {
    this.router.navigate(['/usuario/realizar-pago']);
  }

  irAHistorial(): void {
    this.router.navigate(['/usuario/historial-pagos']);
  }

  irAGestionarGastos(): void {
    this.router.navigate(['/admin/gestionar-gastos']);
  }

  irAGestionarResidentes(): void {
    this.router.navigate(['/admin/gestionar-residentes']);
  }

  irAReportes(): void {
    this.router.navigate(['/admin/reportes']);
  }

  // ===================================
  // UTILIDADES
  // ===================================

  obtenerClaseEstado(estado: string): string {
    const clases: { [key: string]: string } = {
      'Activo': 'bg-success',
      'Pendiente': 'bg-warning',
      'Pagado': 'bg-info',
      'Vencido': 'bg-danger'
    };
    return clases[estado] || 'bg-secondary';
  }

  // ===================================
  // ACCESO A DATOS (localStorage)
  // ===================================

  private obtenerUsuarios(): Usuario[] {
    const usuariosStr = localStorage.getItem('usuarios');
    return usuariosStr ? JSON.parse(usuariosStr) : [];
  }

  private obtenerGastos(): Gasto[] {
    const gastosStr = localStorage.getItem('gastos');
    return gastosStr ? JSON.parse(gastosStr) : [];
  }

  private obtenerPagos(): Pago[] {
    const pagosStr = localStorage.getItem('pagos');
    return pagosStr ? JSON.parse(pagosStr) : [];
  }

  // ===================================
  // INICIALIZAR DATOS DE PRUEBA
  // ===================================

  private inicializarDatosPrueba(): void {
    let gastos = this.obtenerGastos();
    let pagos = this.obtenerPagos();

    // Si no existen gastos, crear datos de prueba
    if (gastos.length === 0) {
      gastos = [
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
          descripcion: 'Consumo de agua mes de noviembre',
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
      localStorage.setItem('gastos', JSON.stringify(gastos));
    }

    // Si no existen pagos, crear datos de prueba
    if (pagos.length === 0) {
      pagos = [
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
        }
      ];
      localStorage.setItem('pagos', JSON.stringify(pagos));
    }

    // Crear algunos residentes de prueba si no existen
    let usuarios = this.obtenerUsuarios();
    const residentesExistentes = usuarios.filter(u => u.casa);

    if (residentesExistentes.length === 0) {
      const residentesPrueba: Usuario[] = [
        {
          nombre: 'Juan Pérez López',
          rut: '12.345.678-9',
          email: 'juan.perez@email.com',
          telefono: '912345678',
          password: 'User123!',
          pasaje: '8651',
          casa: 'A',
          rol: 'residente',
          fechaRegistro: new Date().toISOString()
        },
        {
          nombre: 'María González Silva',
          rut: '13.456.789-0',
          email: 'maria.gonzalez@email.com',
          telefono: '923456789',
          password: 'User123!',
          pasaje: '8651',
          casa: 'B',
          rol: 'residente',
          fechaRegistro: new Date().toISOString()
        },
        {
          nombre: 'Carlos Rojas Muñoz',
          rut: '14.567.890-1',
          email: 'carlos.rojas@email.com',
          telefono: '934567890',
          password: 'User123!',
          pasaje: '8707',
          casa: 'C',
          rol: 'residente',
          fechaRegistro: new Date().toISOString()
        },
        {
          nombre: 'Ana Torres Vega',
          rut: '15.678.901-2',
          email: 'ana.torres@email.com',
          telefono: '945678901',
          password: 'User123!',
          pasaje: '8707',
          casa: 'D',
          rol: 'residente',
          fechaRegistro: new Date().toISOString()
        }
      ];

      usuarios = usuarios.concat(residentesPrueba);
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
  }
}
