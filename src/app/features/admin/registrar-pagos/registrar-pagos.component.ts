import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { AuthService } from '../../../core/services/auth.service';

interface Residente {
  nombre: string;
  email: string;
  pasaje: string;
  casa: string;
}

interface Pago {
  id: string;
  residenteEmail: string;
  residenteNombre: string;
  casa: string;
  mes: string;
  monto: number;
  fechaPago: string;
  metodoPago: string;
  comprobante?: string;
  observaciones?: string;
  registradoPor: string;
  fechaRegistro: string;
}

interface PagoForm {
  residenteEmail: string;
  mes: string;
  monto: number;
  fechaPago: string;
  metodoPago: string;
  comprobante: string;
  observaciones: string;
}

@Component({
  selector: 'app-registrar-pagos',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './registrar-pagos.component.html',
  styleUrls: ['./registrar-pagos.component.scss']
})
export class RegistrarPagosComponent implements OnInit {
  residentes: Residente[] = [];
  pagos: Pago[] = [];
  
  pagoForm: PagoForm = {
    residenteEmail: '',
    mes: '',
    monto: 0,
    fechaPago: '',
    metodoPago: '',
    comprobante: '',
    observaciones: ''
  };

  // Estadísticas
  totalGastosMes: number = 0;
  montoPorCasa: number = 0;
  montoSugerido: number = 0;
  totalPagado: number = 0;
  pendientePorCobrar: number = 0;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.cargarResidentes();
    this.cargarPagos();
    this.calcularEstadisticas();
    this.establecerFechaActual();
  }

  cargarResidentes(): void {
    const usuarios = this.obtenerUsuarios();
    this.residentes = usuarios
      .filter(u => u.casa && u.pasaje)
      .map(u => ({
        nombre: u.nombre,
        email: u.email,
        pasaje: u.pasaje,
        casa: u.casa
      }));
  }

  cargarPagos(): void {
    const pagosGuardados = localStorage.getItem('pagos');
    this.pagos = pagosGuardados ? JSON.parse(pagosGuardados) : [];
    
    // Ordenar por fecha de registro (más recientes primero)
    this.pagos.sort((a, b) => new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime());
  }

  calcularEstadisticas(): void {
    // Obtener gastos del mes actual
    const mesActual = new Date().toISOString().substring(0, 7); // YYYY-MM
    const gastos = this.obtenerGastos();
    
    this.totalGastosMes = gastos
      .filter(g => g.mes === mesActual)
      .reduce((sum, g) => sum + g.monto, 0);
    
    this.montoPorCasa = Math.ceil(this.totalGastosMes / 13);
    this.montoSugerido = this.montoPorCasa;
    
    // Calcular pagos del mes actual
    this.totalPagado = this.pagos
      .filter(p => p.mes === mesActual)
      .reduce((sum, p) => sum + p.monto, 0);
    
    this.pendientePorCobrar = (this.montoPorCasa * 13) - this.totalPagado;
  }

  onResidenteChange(): void {
    // Aquí podrías cargar el monto sugerido específico para ese residente
    this.montoSugerido = this.montoPorCasa;
    this.pagoForm.monto = this.montoPorCasa;
  }

  establecerFechaActual(): void {
    const ahora = new Date();
    // Formato para datetime-local: YYYY-MM-DDTHH:mm
    const año = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const dia = String(ahora.getDate()).padStart(2, '0');
    const horas = String(ahora.getHours()).padStart(2, '0');
    const minutos = String(ahora.getMinutes()).padStart(2, '0');
    
    this.pagoForm.fechaPago = `${año}-${mes}-${dia}T${horas}:${minutos}`;
    this.pagoForm.mes = `${año}-${mes}`;
  }

  registrarPago(): void {
    if (!this.validarFormulario()) {
      return;
    }

    const residente = this.residentes.find(r => r.email === this.pagoForm.residenteEmail);
    if (!residente) {
      alert('❌ Residente no encontrado');
      return;
    }

    const usuario = this.authService.getCurrentUser();
    
    const nuevoPago: Pago = {
      id: this.generarId(),
      residenteEmail: this.pagoForm.residenteEmail,
      residenteNombre: residente.nombre,
      casa: `${residente.pasaje}-${residente.casa}`,
      mes: this.pagoForm.mes,
      monto: Number(this.pagoForm.monto),
      fechaPago: this.pagoForm.fechaPago,
      metodoPago: this.pagoForm.metodoPago,
      comprobante: this.pagoForm.comprobante,
      observaciones: this.pagoForm.observaciones,
      registradoPor: usuario?.nombre || 'Admin',
      fechaRegistro: new Date().toISOString()
    };

    this.pagos.unshift(nuevoPago); // Agregar al inicio
    this.guardarPagos();
    
    alert(`✅ Pago registrado correctamente\n\n` +
          `Residente: ${residente.nombre}\n` +
          `Monto: $${this.pagoForm.monto.toLocaleString('es-CL')}\n` +
          `Mes: ${this.formatearMes(this.pagoForm.mes)}`);
    
    this.limpiarFormulario();
    this.calcularEstadisticas();
  }

  eliminarPago(id: string): void {
    const pago = this.pagos.find(p => p.id === id);
    if (!pago) return;

    if (confirm(`¿Está seguro de eliminar este pago?\n\n` +
                `Residente: ${pago.residenteNombre}\n` +
                `Monto: $${pago.monto.toLocaleString('es-CL')}`)) {
      this.pagos = this.pagos.filter(p => p.id !== id);
      this.guardarPagos();
      this.calcularEstadisticas();
      alert('✅ Pago eliminado correctamente');
    }
  }

  limpiarFormulario(): void {
    this.pagoForm = {
      residenteEmail: '',
      mes: '',
      monto: 0,
      fechaPago: '',
      metodoPago: '',
      comprobante: '',
      observaciones: ''
    };
    this.establecerFechaActual();
  }

  validarFormulario(): boolean {
    if (!this.pagoForm.residenteEmail) {
      alert('❌ Debe seleccionar un residente');
      return false;
    }
    if (!this.pagoForm.mes) {
      alert('❌ Debe seleccionar el mes de pago');
      return false;
    }
    if (!this.pagoForm.monto || this.pagoForm.monto <= 0) {
      alert('❌ El monto debe ser mayor a 0');
      return false;
    }
    if (!this.pagoForm.fechaPago) {
      alert('❌ Debe ingresar la fecha de pago');
      return false;
    }
    if (!this.pagoForm.metodoPago) {
      alert('❌ Debe seleccionar el método de pago');
      return false;
    }
    return true;
  }

  // Utilidades
  obtenerUsuarios(): any[] {
    const usuarios = localStorage.getItem('usuarios');
    return usuarios ? JSON.parse(usuarios) : [];
  }

  obtenerGastos(): any[] {
    const gastos = localStorage.getItem('gastos');
    return gastos ? JSON.parse(gastos) : [];
  }

  guardarPagos(): void {
    localStorage.setItem('pagos', JSON.stringify(this.pagos));
  }

  generarId(): string {
    return 'pago_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  formatearMes(mes: string): string {
    const [año, mesNum] = mes.split('-');
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return `${meses[parseInt(mesNum) - 1]} ${año}`;
  }
}
