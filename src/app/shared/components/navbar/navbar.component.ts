import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  nombreUsuario: string = 'Usuario';
  esAdmin: boolean = false;
  menuItems: MenuItem[] = [];
  dropdownAbierto: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!event.target.closest('.dropdown')) {
      this.dropdownAbierto = false;
    }
  }

  ngOnInit(): void {
    const usuario = this.authService.getCurrentUser();
    if (usuario) {
      this.nombreUsuario = usuario.nombre;
      this.esAdmin = this.authService.isAdmin();
      this.cargarMenu();
    }
  }

  cargarMenu(): void {
    if (this.esAdmin) {
      this.menuItems = [
        { label: 'Dashboard', icon: 'bi-speedometer2', route: '/admin/dashboard' },
        { label: 'Gestionar Gastos', icon: 'bi-receipt', route: '/admin/gestionar-gastos' },
        { label: 'Residentes', icon: 'bi-people', route: '/admin/gestionar-residentes' },
        { label: 'Registrar Pagos', icon: 'bi-credit-card', route: '/admin/registrar-pagos' },
        { label: 'Solicitudes', icon: 'bi-envelope-check', route: '/admin/solicitudes' },
        { label: 'Reportes', icon: 'bi-file-earmark-bar-graph', route: '/admin/reportes' },
        { label: 'Configuración', icon: 'bi-gear', route: '/admin/configuracion' }
      ];
      console.log('Menú Admin cargado:', this.menuItems.length, 'items');
    } else {
      this.menuItems = [
        { label: 'Dashboard', icon: 'bi-speedometer2', route: '/usuario/dashboard' },
        { label: 'Mis Gastos', icon: 'bi-receipt', route: '/usuario/mis-gastos' },
        { label: 'Historial de Pagos', icon: 'bi-clock-history', route: '/usuario/historial-pagos' },
        { label: 'Realizar Pago', icon: 'bi-credit-card', route: '/usuario/realizar-pago' }
      ];
      console.log('Menú Usuario cargado:', this.menuItems.length, 'items');
    }
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.dropdownAbierto = !this.dropdownAbierto;
    console.log('🔽 Dropdown:', this.dropdownAbierto ? 'ABIERTO' : 'CERRADO');
  }

  irAPerfil(event: Event): void {
    event.stopPropagation();
    console.log('👤 Navegando a perfil...');
    this.dropdownAbierto = false;
    this.router.navigate(['/perfil']);
  }

  cerrarSesion(event: Event): void {
    event.stopPropagation();
    console.log('🚪 Intentando cerrar sesión...');
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      this.dropdownAbierto = false;
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}
