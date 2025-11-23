import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-realizar-pago',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './realizar-pago.component.html',
  styleUrls: ['./realizar-pago.component.scss']
})
export class RealizarPagoComponent implements OnInit {
  usuario: any = {};
  montoPagar: number = 0;
  periodoActual: string = '';
  fechaActual: Date = new Date();
  yaPago: boolean = false;
  fechaUltimoPago: string = '';
  mostrarInfoBancaria: boolean = false;

  pago = {
    metodoPago: '',
    numeroReferencia: '',
    confirmacion: false
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarUsuario();
    this.calcularMonto();
    this.establecerPeriodo();
    this.verificarPagoMesActual();
  }

  cargarUsuario(): void {
    const usuarioActual = this.authService.getCurrentUser();
    if (usuarioActual) {
      this.usuario = usuarioActual;
    } else {
      this.router.navigate(['/login']);
    }
  }

  calcularMonto(): void {
    // Obtener gastos del mes actual
    const gastos = this.obtenerGastos();
    const mesActual = new Date().toISOString().substring(0, 7);
    
    const gastosMes = gastos.filter((g: any) => g.mes === mesActual);
    const totalGastos = gastosMes.reduce((sum: number, g: any) => sum + g.monto, 0);
    
    // Dividir entre 13 casas
    this.montoPagar = Math.ceil(totalGastos / 13);
  }

  establecerPeriodo(): void {
    const fecha = new Date();
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    this.periodoActual = `${meses[fecha.getMonth()]} ${fecha.getFullYear()}`;
  }

  verificarPagoMesActual(): void {
    const pagos = this.obtenerPagos();
    const mesActual = new Date().toISOString().substring(0, 7);
    const casa = `${this.usuario.pasaje}-${this.usuario.casa}`;
    
    const pagoMes = pagos.find((p: any) => 
      p.casa === casa && p.mes === mesActual
    );
    
    if (pagoMes) {
      this.yaPago = true;
      this.fechaUltimoPago = pagoMes.fechaPago;
    }
  }

  onMetodoChange(): void {
    this.mostrarInfoBancaria = this.pago.metodoPago === 'transferencia';
  }

  realizarPago(): void {
    if (!this.validarPago()) {
      return;
    }

    // Crear registro de pago
    const pagos = this.obtenerPagos();
    const mesActual = new Date().toISOString().substring(0, 7);
    
    const nuevoPago = {
      id: 'pago_' + Date.now(),
      residenteEmail: this.usuario.email,
      residenteNombre: this.usuario.nombre,
      casa: `${this.usuario.pasaje}-${this.usuario.casa}`,
      mes: mesActual,
      monto: this.montoPagar,
      fechaPago: new Date().toISOString(),
      metodoPago: this.pago.metodoPago,
      comprobante: this.pago.numeroReferencia,
      registradoPor: this.usuario.nombre,
      fechaRegistro: new Date().toISOString()
    };

    pagos.push(nuevoPago);
    this.guardarPagos(pagos);

    alert(`✅ ¡Pago registrado correctamente!\n\n` +
          `Monto: $${this.montoPagar.toLocaleString('es-CL')}\n` +
          `Método: ${this.getMetodoNombre()}\n` +
          `Período: ${this.periodoActual}\n\n` +
          `Recibirás una confirmación por correo electrónico.`);

    // Recargar para mostrar que ya pagó
    this.verificarPagoMesActual();
  }

  validarPago(): boolean {
    if (!this.pago.metodoPago) {
      alert('❌ Debes seleccionar un método de pago');
      return false;
    }

    if (!this.pago.confirmacion) {
      alert('❌ Debes confirmar que realizaste el pago');
      return false;
    }

    return true;
  }

  getMetodoNombre(): string {
    const metodos: any = {
      'transferencia': 'Transferencia Bancaria',
      'debito': 'Tarjeta de Débito',
      'credito': 'Tarjeta de Crédito',
      'efectivo': 'Efectivo'
    };
    return metodos[this.pago.metodoPago] || this.pago.metodoPago;
  }

  cancelar(): void {
    if (confirm('¿Estás seguro de cancelar el pago?')) {
      this.router.navigate(['/usuario/dashboard']);
    }
  }

  // Utilidades
  obtenerGastos(): any[] {
    const gastos = localStorage.getItem('gastos');
    return gastos ? JSON.parse(gastos) : [];
  }

  obtenerPagos(): any[] {
    const pagos = localStorage.getItem('pagos');
    return pagos ? JSON.parse(pagos) : [];
  }

  guardarPagos(pagos: any[]): void {
    localStorage.setItem('pagos', JSON.stringify(pagos));
  }
}
