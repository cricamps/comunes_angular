import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { AuthService } from '../../../core/services/auth.service';
import { Pago } from '../../../models/pago.interface';

@Component({
  selector: 'app-historial-pagos',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './historial-pagos.component.html',
  styleUrl: './historial-pagos.component.scss'
})
export class HistorialPagosComponent implements OnInit {
  misPagos: Pago[] = [];
  totalPagado: number = 0;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.cargarMisPagos();
  }

  cargarMisPagos(): void {
    const usuario = this.authService.getCurrentUser();
    if (!usuario) return;

    const pagosStr = localStorage.getItem('pagos');
    const pagos: Pago[] = pagosStr ? JSON.parse(pagosStr) : [];
    
    this.misPagos = pagos.filter(p => 
      p.email === usuario.email || 
      (p.pasaje === usuario.pasaje && p.casa === usuario.casa)
    );

    this.totalPagado = this.misPagos.reduce((sum, p) => sum + p.monto, 0);
  }
}
