import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
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

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const usuario = this.authService.getCurrentUser();
    if (!usuario) {
      this.router.navigate(['/login']);
      return;
    }

    this.cargarMiInformacion();
  }

  cargarMiInformacion(): void {
    const usuario = this.authService.getCurrentUser();
    if (!usuario) return;

    // Mostrar mi casa
    this.miCasa = `Pasaje ${usuario.pasaje} - Casa ${usuario.casa}`;

    // Calcular mi deuda
    const gastos = this.obtenerGastos();
    const gastosAprobados = gastos.filter((g: any) => g.estado === 'Activo' || g.estado === 'aprobado');
    const totalGastos = gastosAprobados.reduce((sum: number, g: any) => sum + g.monto, 0);
    this.miDeuda = Math.round(totalGastos / 13);

    // Verificar último pago
    const pagos = this.obtenerPagos();
    const misPagos = pagos.filter((p: any) => 
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

  irAPagar(): void {
    this.router.navigate(['/usuario/realizar-pago']);
  }

  irAHistorial(): void {
    this.router.navigate(['/usuario/historial-pagos']);
  }

  irAMisGastos(): void {
    this.router.navigate(['/usuario/mis-gastos']);
  }

  private obtenerGastos(): any[] {
    const gastosStr = localStorage.getItem('gastos');
    return gastosStr ? JSON.parse(gastosStr) : [];
  }

  private obtenerPagos(): any[] {
    const pagosStr = localStorage.getItem('pagos');
    return pagosStr ? JSON.parse(pagosStr) : [];
  }
}
