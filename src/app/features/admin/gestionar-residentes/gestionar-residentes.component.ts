import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

interface Usuario {
  nombre: string;
  rut: string;
  fechaNacimiento?: string;
  edad?: number;
  email: string;
  telefono: string;
  pasaje: string;
  casa: string;
  parentesco?: string;
  esTitular?: boolean;
  rol: string;
  tipo?: string;
  password?: string;
  fechaRegistro?: string;
}

interface Estadisticas {
  totalResidentes: number;
  casasOcupadas: number;
  casasDisponibles: number;
  porcentajeOcupacion: number;
}

@Component({
  selector: 'app-gestionar-residentes',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './gestionar-residentes.component.html',
  styleUrls: ['./gestionar-residentes.component.scss']
})
export class GestionarResidentesComponent implements OnInit {
  // Datos
  residentes: Usuario[] = [];
  residentesFiltrados: Usuario[] = [];
  sesionActual: any = null;

  // Estadísticas
  estadisticas: Estadisticas = {
    totalResidentes: 0,
    casasOcupadas: 0,
    casasDisponibles: 0,
    porcentajeOcupacion: 0
  };

  // Filtros
  busqueda: string = '';
  filtroPasaje: string = '';
  filtroCasa: string = '';
  casasFiltro: string[] = [];

  // Modal Nuevo/Editar
  mostrarModal: boolean = false;
  tituloModal: string = 'Nuevo Residente';
  residenteForm: Usuario = this.nuevoResidenteVacio();
  emailOriginal: string = '';
  casasDisponiblesModal: string[] = [];
  residentesEnCasa: Usuario[] = [];

  // Modal Ver Detalles
  mostrarModalVer: boolean = false;
  residenteDetalle: Usuario | null = null;

  // Modal Eliminar
  mostrarModalEliminar: boolean = false;
  residenteEliminar: Usuario | null = null;

  // Configuración
  readonly CASAS_8651 = ['A', 'B', 'C', 'D', 'E', 'F'];
  readonly CASAS_8707 = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  readonly TOTAL_CASAS = 13;
  readonly MAX_RESIDENTES_POR_CASA = 10;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.verificarSesionAdmin();
    this.cargarResidentes();
    this.cargarEstadisticas();
  }

  // ===================================
  // GESTIÓN DE SESIÓN
  // ===================================

  verificarSesionAdmin(): void {
    const usuario = this.authService.getCurrentUser();
    if (usuario) {
      this.sesionActual = usuario;
      if (!this.authService.isAdmin()) {
        console.log('No es admin, redirigiendo...');
        this.router.navigate(['/login']);
      } else {
        console.log('Admin verificado:', usuario.nombre);
      }
    } else {
      console.log('No hay sesión, redirigiendo a login');
      this.router.navigate(['/login']);
    }
  }

  get nombreAdmin(): string {
    return this.sesionActual?.nombre || 'Admin';
  }

  cerrarSesion(): void {
    if (confirm('¿Cerrar sesión?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }

  // ===================================
  // CARGA DE DATOS
  // ===================================

  cargarResidentes(): void {
    const usuarios = this.obtenerUsuarios();
    this.residentes = usuarios.filter((u: Usuario) => u.casa);
    this.residentesFiltrados = [...this.residentes];
  }

  cargarEstadisticas(): void {
    const usuarios = this.obtenerUsuarios();
    const residentesCasa = usuarios.filter((u: Usuario) => u.pasaje && u.casa);
    
    const casasUnicas = new Set(residentesCasa.map((r: Usuario) => `${r.pasaje}-${r.casa}`));
    const casasOcupadas = casasUnicas.size;
    const casasDisponibles = this.TOTAL_CASAS - casasOcupadas;
    const porcentaje = Math.round((casasOcupadas / this.TOTAL_CASAS) * 100);
    
    this.estadisticas = {
      totalResidentes: residentesCasa.length,
      casasOcupadas,
      casasDisponibles,
      porcentajeOcupacion: porcentaje
    };
  }

  // ===================================
  // FILTROS
  // ===================================

  aplicarFiltros(): void {
    this.residentesFiltrados = this.residentes.filter(r => {
      const busquedaLower = this.busqueda.toLowerCase();
      const coincideBuscar = 
        r.nombre.toLowerCase().includes(busquedaLower) ||
        r.rut.includes(busquedaLower) ||
        r.email.toLowerCase().includes(busquedaLower);
      
      const coincidePasaje = !this.filtroPasaje || r.pasaje === this.filtroPasaje;
      const coincideCasa = !this.filtroCasa || r.casa === this.filtroCasa;
      
      return coincideBuscar && coincidePasaje && coincideCasa;
    });
  }

  onFiltroPasajeChange(): void {
    this.filtroCasa = '';
    this.actualizarCasasFiltro();
    this.aplicarFiltros();
  }

  actualizarCasasFiltro(): void {
    if (this.filtroPasaje === '8651') {
      this.casasFiltro = this.CASAS_8651;
    } else if (this.filtroPasaje === '8707') {
      this.casasFiltro = this.CASAS_8707;
    } else {
      this.casasFiltro = [];
    }
  }

  limpiarFiltros(): void {
    this.busqueda = '';
    this.filtroPasaje = '';
    this.filtroCasa = '';
    this.casasFiltro = [];
    this.residentesFiltrados = [...this.residentes];
  }

  // ===================================
  // MODAL NUEVO/EDITAR RESIDENTE
  // ===================================

  abrirModalNuevo(): void {
    this.residenteForm = this.nuevoResidenteVacio();
    this.emailOriginal = '';
    this.tituloModal = 'Nuevo Residente';
    this.casasDisponiblesModal = [];
    this.residentesEnCasa = [];
    this.mostrarModal = true;
  }

  abrirModalEditar(residente: Usuario): void {
    this.residenteForm = { ...residente };
    this.emailOriginal = residente.email;
    this.tituloModal = 'Editar Residente';
    this.actualizarCasasModal();
    this.mostrarResidentesEnCasa();
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.residenteForm = this.nuevoResidenteVacio();
    this.emailOriginal = '';
  }

  onPasajeChange(): void {
    this.residenteForm.casa = '';
    this.actualizarCasasModal();
    this.residentesEnCasa = [];
  }

  onCasaChange(): void {
    this.mostrarResidentesEnCasa();
  }

  actualizarCasasModal(): void {
    if (this.residenteForm.pasaje === '8651') {
      this.casasDisponiblesModal = this.CASAS_8651;
    } else if (this.residenteForm.pasaje === '8707') {
      this.casasDisponiblesModal = this.CASAS_8707;
    } else {
      this.casasDisponiblesModal = [];
    }
  }

  mostrarResidentesEnCasa(): void {
    if (!this.residenteForm.pasaje || !this.residenteForm.casa) {
      this.residentesEnCasa = [];
      return;
    }

    this.residentesEnCasa = this.residentes.filter(r =>
      r.pasaje === this.residenteForm.pasaje &&
      r.casa === this.residenteForm.casa &&
      r.email !== this.emailOriginal
    );
  }

  onEsTitularChange(): void {
    if (!this.residenteForm.pasaje || !this.residenteForm.casa) {
      alert('Primero seleccione pasaje y casa');
      this.residenteForm.esTitular = false;
      return;
    }

    if (this.residenteForm.esTitular) {
      const usuarios = this.obtenerUsuarios();
      const titularActual = usuarios.find((u: Usuario) =>
        u.pasaje === this.residenteForm.pasaje &&
        u.casa === this.residenteForm.casa &&
        u.esTitular === true &&
        u.email !== this.emailOriginal
      );

      if (titularActual) {
        const confirmar = confirm(
          `⚠️ ATENCIÓN: Ya existe un titular en esta casa:\n\n` +
          `${titularActual.nombre} (${titularActual.parentesco || 'Sin parentesco'})\n\n` +
          `Si continúa, ${titularActual.nombre} dejará de ser el titular principal.\n\n` +
          `¿Desea continuar?`
        );

        if (!confirmar) {
          this.residenteForm.esTitular = false;
          return;
        }
      }

      if (this.residenteForm.parentesco !== 'titular') {
        const cambiarParentesco = confirm(
          '¿Desea cambiar también el parentesco a "Titular/Propietario"?'
        );
        if (cambiarParentesco) {
          this.residenteForm.parentesco = 'titular';
        }
      }
    }
  }

  onParentescoChange(): void {
    if (this.residenteForm.parentesco === 'titular' && !this.residenteForm.esTitular) {
      const marcar = confirm(
        '¿Desea marcar también a esta persona como el titular principal de la casa?\n\n' +
        'Esto le dará prioridad en notificaciones y documentos oficiales.'
      );

      if (marcar) {
        this.residenteForm.esTitular = true;
        this.onEsTitularChange();
      }
    }
  }

  guardarResidente(): void {
    if (!this.validarFormulario()) {
      return;
    }

    let usuarios = this.obtenerUsuarios();

    // Validar capacidad de la casa
    if (!this.emailOriginal || this.cambióDeCasa()) {
      const cantidadEnCasa = usuarios.filter((u: Usuario) =>
        u.pasaje === this.residenteForm.pasaje &&
        u.casa === this.residenteForm.casa
      ).length;

      if (cantidadEnCasa >= this.MAX_RESIDENTES_POR_CASA) {
        alert(`❌ Esta casa ya tiene ${this.MAX_RESIDENTES_POR_CASA} residentes (máximo permitido)`);
        return;
      }
    }

    // Validar email único
    const emailExiste = usuarios.some((u: Usuario) =>
      u.email === this.residenteForm.email && u.email !== this.emailOriginal
    );

    if (emailExiste) {
      alert('❌ Este email ya está registrado');
      return;
    }

    // Calcular edad si hay fecha de nacimiento
    if (this.residenteForm.fechaNacimiento) {
      this.residenteForm.edad = this.calcularEdad(this.residenteForm.fechaNacimiento);
    }

    if (this.emailOriginal) {
      // Editar
      const index = usuarios.findIndex((u: Usuario) => u.email === this.emailOriginal);
      if (index !== -1) {
        const usuarioActual = usuarios[index];
        usuarios[index] = {
          ...usuarioActual,
          ...this.residenteForm,
          password: usuarioActual.password,
          fechaRegistro: usuarioActual.fechaRegistro
        };
      }
    } else {
      // Nuevo
      const nuevoResidente = {
        ...this.residenteForm,
        password: 'User123!',
        tipo: this.residenteForm.rol,
        fechaRegistro: new Date().toISOString()
      };
      usuarios.push(nuevoResidente);
    }

    // Si se marcó como titular, quitar el flag de otros
    if (this.residenteForm.esTitular) {
      usuarios.forEach((u: any) => {
        if (
          u.pasaje === this.residenteForm.pasaje &&
          u.casa === this.residenteForm.casa &&
          u.email !== this.residenteForm.email
        ) {
          u.esTitular = false;
        }
      });
    }

    this.guardarUsuarios(usuarios);
    this.cargarResidentes();
    this.cargarEstadisticas();
    this.cerrarModal();

    const cantidadEnCasa = usuarios.filter((u: Usuario) =>
      u.pasaje === this.residenteForm.pasaje &&
      u.casa === this.residenteForm.casa
    ).length;

    alert(
      `✅ ${this.residenteForm.nombre} ${this.emailOriginal ? 'actualizado' : 'agregado'} correctamente\n` +
      `(${cantidadEnCasa} persona${cantidadEnCasa > 1 ? 's' : ''} en esta casa)`
    );
  }

  // ===================================
  // MODAL VER DETALLES
  // ===================================

  verResidente(residente: Usuario): void {
    this.residenteDetalle = residente;
    this.mostrarModalVer = true;
  }

  cerrarModalVer(): void {
    this.mostrarModalVer = false;
    this.residenteDetalle = null;
  }

  get otrosResidentesEnCasaDetalle(): Usuario[] {
    if (!this.residenteDetalle) return [];

    return this.residentes.filter(r =>
      r.pasaje === this.residenteDetalle!.pasaje &&
      r.casa === this.residenteDetalle!.casa &&
      r.email !== this.residenteDetalle!.email
    );
  }

  // ===================================
  // MODAL ELIMINAR
  // ===================================

  abrirModalEliminar(residente: Usuario): void {
    this.residenteEliminar = residente;
    this.mostrarModalEliminar = true;
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.residenteEliminar = null;
  }

  confirmarEliminar(): void {
    if (!this.residenteEliminar) return;

    let usuarios = this.obtenerUsuarios();

    // Advertir si era titular
    if (this.residenteEliminar.esTitular) {
      const otrosEnCasa = usuarios.filter((u: Usuario) =>
        u.pasaje === this.residenteEliminar!.pasaje &&
        u.casa === this.residenteEliminar!.casa &&
        u.email !== this.residenteEliminar!.email
      );

      if (otrosEnCasa.length > 0) {
        alert(
          `⚠️ ${this.residenteEliminar.nombre} era el titular. ` +
          'Recuerde asignar un nuevo titular para esta casa.'
        );
      }
    }

    usuarios = usuarios.filter((u: Usuario) => u.email !== this.residenteEliminar!.email);
    this.guardarUsuarios(usuarios);
    this.cargarResidentes();
    this.cargarEstadisticas();
    this.cerrarModalEliminar();

    alert(`✅ ${this.residenteEliminar.nombre} eliminado correctamente`);
  }

  // ===================================
  // UTILIDADES
  // ===================================

  obtenerUsuarios(): Usuario[] {
    const usuarios = localStorage.getItem('usuarios');
    return usuarios ? JSON.parse(usuarios) : [];
  }

  guardarUsuarios(usuarios: Usuario[]): void {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }

  nuevoResidenteVacio(): Usuario {
    return {
      nombre: '',
      rut: '',
      email: '',
      telefono: '',
      pasaje: '',
      casa: '',
      rol: 'residente',
      parentesco: '',
      esTitular: false
    };
  }

  validarFormulario(): boolean {
    if (!this.residenteForm.nombre || this.residenteForm.nombre.length < 3) {
      alert('❌ El nombre debe tener al menos 3 caracteres');
      return false;
    }

    if (!this.residenteForm.rut) {
      alert('❌ Debe ingresar el RUT');
      return false;
    }

    if (!this.validarRUT(this.residenteForm.rut)) {
      alert('❌ RUT inválido');
      return false;
    }

    if (!this.residenteForm.fechaNacimiento) {
      alert('❌ Debe ingresar la fecha de nacimiento');
      return false;
    }

    const edad = this.calcularEdad(this.residenteForm.fechaNacimiento);
    if (edad < 18) {
      alert('❌ Debe ser mayor de 18 años');
      return false;
    }

    if (!this.residenteForm.email || !this.residenteForm.email.includes('@')) {
      alert('❌ Debe ingresar un email válido');
      return false;
    }

    if (!this.residenteForm.telefono || this.residenteForm.telefono.length !== 9) {
      alert('❌ El teléfono debe tener 9 dígitos');
      return false;
    }

    if (!this.residenteForm.pasaje || !this.residenteForm.casa) {
      alert('❌ Debe seleccionar pasaje y casa');
      return false;
    }

    if (!this.residenteForm.parentesco) {
      alert('❌ Debe seleccionar el parentesco');
      return false;
    }

    return true;
  }

  validarRUT(rut: string): boolean {
    // Validación básica de RUT chileno
    const rutLimpio = rut.replace(/\./g, '').replace(/-/g, '');
    if (rutLimpio.length < 2) return false;

    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1).toUpperCase();

    if (!/^[0-9]+$/.test(cuerpo)) return false;

    let suma = 0;
    let multiplicador = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo.charAt(i)) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const dvEsperado = 11 - (suma % 11);
    const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();

    return dv === dvCalculado;
  }

  formatearRUT(event: any): void {
    let valor = event.target.value.replace(/\./g, '').replace(/-/g, '');

    if (valor.length > 1) {
      const cuerpo = valor.slice(0, -1);
      const dv = valor.slice(-1);

      const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

      this.residenteForm.rut = `${cuerpoFormateado}-${dv}`;
    }
  }

  calcularEdad(fechaNacimiento: string): number {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    return edad;
  }

  cambióDeCasa(): boolean {
    const usuarios = this.obtenerUsuarios();
    const residenteActual = usuarios.find((u: Usuario) => u.email === this.emailOriginal);

    if (!residenteActual) return false;

    return (
      residenteActual.pasaje !== this.residenteForm.pasaje ||
      residenteActual.casa !== this.residenteForm.casa
    );
  }

  obtenerEdad(residente: Usuario): number {
    if (residente.edad) return residente.edad;
    if (residente.fechaNacimiento) {
      return this.calcularEdad(residente.fechaNacimiento);
    }
    return 0;
  }

  obtenerParentescoTexto(parentesco: string | undefined): string {
    if (!parentesco) return 'No especificado';
    return parentesco.charAt(0).toUpperCase() + parentesco.slice(1);
  }

  contarResidentesEnCasa(pasaje: string, casa: string): number {
    return this.residentes.filter(r => r.pasaje === pasaje && r.casa === casa).length;
  }

  navegarA(ruta: string): void {
    this.router.navigate([ruta]);
  }
}
