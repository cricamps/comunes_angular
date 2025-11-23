import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { AuthService } from '../../../core/services/auth.service';

interface Solicitud {
  id: string;
  nombre: string;
  rut: string;
  email: string;
  telefono: string;
  pasaje: string;
  casa: string;
  mensaje?: string;
  fecha: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
}

interface Estadisticas {
  pendientes: number;
  aprobadas: number;
  rechazadas: number;
}

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.scss']
})
export class SolicitudesComponent implements OnInit {
  solicitudes: Solicitud[] = [];
  solicitudesFiltradas: Solicitud[] = [];
  
  // Filtros
  filtroEstado: string = 'pendiente';
  busqueda: string = '';
  
  // Estadísticas
  estadisticas: Estadisticas = {
    pendientes: 0,
    aprobadas: 0,
    rechazadas: 0
  };
  
  // Modal
  mostrarModal: boolean = false;
  solicitudDetalle: Solicitud | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.cargarSolicitudes();
    this.calcularEstadisticas();
    this.aplicarFiltros();
  }

  cargarSolicitudes(): void {
    const solicitudesGuardadas = localStorage.getItem('solicitudes');
    this.solicitudes = solicitudesGuardadas ? JSON.parse(solicitudesGuardadas) : [];
    
    // Ordenar por fecha (más recientes primero)
    this.solicitudes.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }

  calcularEstadisticas(): void {
    this.estadisticas = {
      pendientes: this.solicitudes.filter(s => s.estado === 'pendiente').length,
      aprobadas: this.solicitudes.filter(s => s.estado === 'aprobada').length,
      rechazadas: this.solicitudes.filter(s => s.estado === 'rechazada').length
    };
  }

  aplicarFiltros(): void {
    this.solicitudesFiltradas = this.solicitudes.filter(s => {
      const cumpleEstado = !this.filtroEstado || s.estado === this.filtroEstado;
      
      const busquedaLower = this.busqueda.toLowerCase();
      const cumpleBusqueda = !this.busqueda || 
        s.nombre.toLowerCase().includes(busquedaLower) ||
        s.email.toLowerCase().includes(busquedaLower) ||
        s.rut.includes(busquedaLower);
      
      return cumpleEstado && cumpleBusqueda;
    });
  }

  limpiarFiltros(): void {
    this.filtroEstado = '';
    this.busqueda = '';
    this.aplicarFiltros();
  }

  verDetalle(solicitud: Solicitud): void {
    this.solicitudDetalle = solicitud;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.solicitudDetalle = null;
  }

  aprobarSolicitud(solicitud: Solicitud): void {
    const confirmacion = confirm(
      `¿Aprobar solicitud de ${solicitud.nombre}?\n\n` +
      `Se creará una cuenta de usuario y se le enviará un email de confirmación.`
    );

    if (!confirmacion) return;

    // Actualizar estado
    solicitud.estado = 'aprobada';
    this.guardarSolicitudes();
    
    // Crear usuario
    this.crearUsuario(solicitud);
    
    this.calcularEstadisticas();
    this.aplicarFiltros();
    this.cerrarModal();
    
    alert(`✅ Solicitud aprobada\n\n` +
          `Se ha creado la cuenta para ${solicitud.nombre}\n` +
          `Email: ${solicitud.email}\n` +
          `Contraseña temporal: User123!`);
  }

  rechazarSolicitud(solicitud: Solicitud): void {
    const motivo = prompt('Motivo del rechazo (opcional):');
    
    if (motivo === null) return; // Usuario canceló

    solicitud.estado = 'rechazada';
    this.guardarSolicitudes();
    
    this.calcularEstadisticas();
    this.aplicarFiltros();
    this.cerrarModal();
    
    alert(`❌ Solicitud rechazada\n\n` +
          `Residente: ${solicitud.nombre}\n` +
          `${motivo ? 'Motivo: ' + motivo : ''}`);
  }

  eliminarSolicitud(solicitud: Solicitud): void {
    if (!confirm(`¿Eliminar la solicitud de ${solicitud.nombre}?`)) return;

    this.solicitudes = this.solicitudes.filter(s => s.id !== solicitud.id);
    this.guardarSolicitudes();
    
    this.calcularEstadisticas();
    this.aplicarFiltros();
    
    alert('✅ Solicitud eliminada');
  }

  crearUsuario(solicitud: Solicitud): void {
    const usuarios = this.obtenerUsuarios();
    
    // Verificar si el email ya existe
    const emailExiste = usuarios.some((u: any) => u.email === solicitud.email);
    if (emailExiste) {
      alert('⚠️ El email ya está registrado');
      return;
    }

    const nuevoUsuario = {
      nombre: solicitud.nombre,
      rut: solicitud.rut,
      email: solicitud.email,
      telefono: solicitud.telefono,
      pasaje: solicitud.pasaje,
      casa: solicitud.casa,
      password: 'User123!',
      rol: 'residente',
      tipo: 'residente',
      fechaRegistro: new Date().toISOString()
    };

    usuarios.push(nuevoUsuario);
    this.guardarUsuarios(usuarios);
  }

  // Utilidades
  obtenerUsuarios(): any[] {
    const usuarios = localStorage.getItem('usuarios');
    return usuarios ? JSON.parse(usuarios) : [];
  }

  guardarUsuarios(usuarios: any[]): void {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }

  guardarSolicitudes(): void {
    localStorage.setItem('solicitudes', JSON.stringify(this.solicitudes));
  }
}
