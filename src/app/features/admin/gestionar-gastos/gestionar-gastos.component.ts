import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { Gasto } from '../../../models/gasto.interface';

declare var bootstrap: any;

@Component({
  selector: 'app-gestionar-gastos',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './gestionar-gastos.component.html',
  styleUrl: './gestionar-gastos.component.scss'
})
export class GestionarGastosComponent implements OnInit {
  gastos: Gasto[] = [];
  gastosFiltrados: Gasto[] = [];
  gastoEditando: Gasto | null = null;
  
  // Modelo del formulario
  formulario: Gasto = this.nuevoGastoVacio();
  
  // Filtros
  buscar: string = '';
  categoriaFiltro: string = '';
  estadoFiltro: string = '';
  
  // Opciones
  categorias: string[] = ['Mantención', 'Servicios Básicos', 'Seguridad', 'Limpieza', 'Reparaciones', 'Otros'];
  estados: string[] = ['Activo', 'Pendiente', 'Pagado', 'Vencido'];
  
  // Modal
  tituloModal: string = 'Nuevo Gasto Común';
  gastoIdEliminar: number = 0;
  gastoNombreEliminar: string = '';

  ngOnInit(): void {
    this.cargarGastos();
  }

  nuevoGastoVacio(): Gasto {
    const hoy = new Date().toISOString().split('T')[0];
    return {
      id: 0,
      concepto: '',
      descripcion: '',
      monto: 0,
      fecha: hoy,
      estado: 'Activo',
      categoria: ''
    };
  }

  cargarGastos(): void {
    const gastosStr = localStorage.getItem('gastos');
    this.gastos = gastosStr ? JSON.parse(gastosStr) : [];
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.gastosFiltrados = this.gastos.filter(g => {
      const coincideBuscar = g.concepto.toLowerCase().includes(this.buscar.toLowerCase()) ||
                            (g.descripcion && g.descripcion.toLowerCase().includes(this.buscar.toLowerCase()));
      const coincideCategoria = !this.categoriaFiltro || g.categoria === this.categoriaFiltro;
      const coincideEstado = !this.estadoFiltro || g.estado === this.estadoFiltro;
      
      return coincideBuscar && coincideCategoria && coincideEstado;
    });
  }

  limpiarFiltros(): void {
    this.buscar = '';
    this.categoriaFiltro = '';
    this.estadoFiltro = '';
    this.aplicarFiltros();
  }

  abrirModalNuevo(): void {
    this.formulario = this.nuevoGastoVacio();
    this.tituloModal = 'Nuevo Gasto Común';
    this.mostrarModal('modalNuevoGasto');
  }

  guardarGasto(): void {
    if (!this.validarFormulario()) {
      return;
    }

    if (this.formulario.id) {
      // Editar
      const index = this.gastos.findIndex(g => g.id === this.formulario.id);
      if (index !== -1) {
        this.gastos[index] = { ...this.formulario };
      }
    } else {
      // Nuevo
      this.formulario.id = Date.now();
      this.gastos.push({ ...this.formulario });
    }

    localStorage.setItem('gastos', JSON.stringify(this.gastos));
    this.cerrarModal('modalNuevoGasto');
    this.cargarGastos();
    this.mostrarToast(this.formulario.id ? 'Gasto actualizado correctamente' : 'Gasto creado correctamente');
  }

  editarGasto(gasto: Gasto): void {
    this.formulario = { ...gasto };
    this.tituloModal = 'Editar Gasto';
    this.mostrarModal('modalNuevoGasto');
  }

  abrirModalEliminar(gasto: Gasto): void {
    this.gastoIdEliminar = gasto.id!;
    this.gastoNombreEliminar = gasto.concepto;
    this.mostrarModal('modalEliminarGasto');
  }

  confirmarEliminar(): void {
    this.gastos = this.gastos.filter(g => g.id !== this.gastoIdEliminar);
    localStorage.setItem('gastos', JSON.stringify(this.gastos));
    this.cerrarModal('modalEliminarGasto');
    this.cargarGastos();
    this.mostrarToast('Gasto eliminado correctamente');
  }

  validarFormulario(): boolean {
    if (!this.formulario.concepto || this.formulario.concepto.trim().length < 3) {
      alert('El concepto debe tener al menos 3 caracteres');
      return false;
    }
    if (!this.formulario.categoria) {
      alert('Debe seleccionar una categoría');
      return false;
    }
    if (!this.formulario.monto || this.formulario.monto <= 0) {
      alert('El monto debe ser mayor a 0');
      return false;
    }
    if (!this.formulario.fecha) {
      alert('Debe seleccionar una fecha');
      return false;
    }
    return true;
  }

  get montoPorCasa(): number {
    return this.formulario.monto / 13;
  }

  formatearMoneda(monto: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(monto);
  }

  obtenerClaseEstado(estado: string): string {
    const clases: { [key: string]: string } = {
      'Activo': 'bg-success',
      'Pendiente': 'bg-warning',
      'Pagado': 'bg-info',
      'Vencido': 'bg-danger'
    };
    return clases[estado] || 'bg-secondary';
  }

  mostrarModal(id: string): void {
    const modalElement = document.getElementById(id);
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  cerrarModal(id: string): void {
    const modalElement = document.getElementById(id);
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }

  mostrarToast(mensaje: string): void {
    const toastElement = document.getElementById('toastExito');
    const mensajeElement = document.getElementById('toastMensaje');
    if (toastElement && mensajeElement) {
      mensajeElement.textContent = mensaje;
      const toast = new bootstrap.Toast(toastElement);
      toast.show();
    }
  }
}
