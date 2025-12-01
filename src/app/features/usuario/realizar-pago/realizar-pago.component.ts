import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CarritoService } from '../../../core/services/carrito.service';
import { AuthService } from '../../../core/services/auth.service';
import { ItemCarrito, Cuota } from '../../../models/cuota.model';
import { obtenerCuotasPendientes } from '../../../data/cuotas-mock';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

/**
 * Componente de Realizar Pago / Carrito de Cuotas
 * 
 * Permite al residente:
 * - Ver todas sus cuotas pendientes
 * - Seleccionar cuáles desea pagar
 * - Agregar cuotas al carrito
 * - Ver el total a pagar
 * - Procesar el pago de las cuotas seleccionadas
 * 
 * @example
 * ```html
 * <app-realizar-pago></app-realizar-pago>
 * ```
 */
@Component({
  selector: 'app-realizar-pago',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './realizar-pago.component.html',
  styleUrl: './realizar-pago.component.scss'
})
export class RealizarPagoComponent implements OnInit {
  
  /** Items del carrito */
  items: ItemCarrito[] = [];
  
  /** Cuotas pendientes disponibles para agregar */
  cuotasDisponibles: Cuota[] = [];
  
  /** Total a pagar */
  total: number = 0;
  
  /** Cantidad de items seleccionados */
  cantidadSeleccionados: number = 0;
  
  /** Datos del usuario actual */
  pasaje: string = '';
  casa: string = '';
  nombreUsuario: string = '';

  /** Estado de procesamiento de pago */
  procesandoPago: boolean = false;

  constructor(
    private carritoService: CarritoService,
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Inicialización del componente
   * 
   * Carga los datos del usuario, las cuotas pendientes y el estado del carrito.
   */
  ngOnInit(): void {
    // Obtener datos del usuario
    this.pasaje = this.authService.getPasaje();
    this.casa = this.authService.getCasa();
    this.nombreUsuario = this.authService.getNombreUsuario();

    // Si no hay sesión, redirigir a login
    if (!this.pasaje || !this.casa) {
      this.router.navigate(['/login']);
      return;
    }

    // Cargar cuotas disponibles
    this.cargarCuotasDisponibles();
    
    // Cargar items del carrito
    this.actualizarCarrito();
  }

  /**
   * Cargar cuotas pendientes del residente
   * 
   * Obtiene las cuotas pendientes y vencidas que puede pagar el residente.
   */
  private cargarCuotasDisponibles(): void {
    this.cuotasDisponibles = obtenerCuotasPendientes(this.pasaje, this.casa);
    console.log('Cuotas disponibles:', this.cuotasDisponibles.length);
  }

  /**
   * Actualizar datos del carrito
   * 
   * Recalcula el total y la cantidad de items seleccionados.
   * Este método se llama cada vez que hay un cambio en el carrito.
   */
  actualizarCarrito(): void {
    this.items = this.carritoService.obtenerItems();
    this.total = this.carritoService.calcularTotal();
    this.cantidadSeleccionados = this.carritoService.obtenerCantidadSeleccionados();
    
    console.log('Carrito actualizado:', {
      items: this.items.length,
      seleccionados: this.cantidadSeleccionados,
      total: this.total
    });
  }

  /**
   * Agregar cuota al carrito
   * 
   * Agrega una cuota al carrito de pagos.
   * La cuota se marca como seleccionada por defecto.
   * 
   * @param {Cuota} cuota - Cuota a agregar
   */
  agregarAlCarrito(cuota: Cuota): void {
    const agregado = this.carritoService.agregarCuota(cuota);
    
    if (agregado) {
      this.actualizarCarrito();
      // Sin mensaje - solo se actualiza el carrito visualmente
    }
  }

  /**
   * Eliminar cuota del carrito
   * 
   * Remueve una cuota del carrito de pagos.
   * 
   * @param {number} cuotaId - ID de la cuota a eliminar
   */
  eliminarDelCarrito(cuotaId: number): void {
    this.carritoService.eliminarCuota(cuotaId);
    this.actualizarCarrito();
    // Sin mensaje - solo se actualiza el carrito visualmente
  }

  /**
   * Alternar selección de cuota
   * 
   * Cambia el estado de selección de una cuota.
   * Solo las cuotas seleccionadas se incluyen en el total a pagar.
   * 
   * @param {number} cuotaId - ID de la cuota
   */
  toggleSeleccion(cuotaId: number): void {
    this.carritoService.toggleSeleccion(cuotaId);
    this.actualizarCarrito();
    // Sin mensaje - el checkbox muestra el cambio
  }

  /**
   * Seleccionar todas las cuotas del carrito
   * 
   * Marca todas las cuotas como seleccionadas para pago.
   */
  seleccionarTodas(): void {
    this.carritoService.seleccionarTodas();
    this.actualizarCarrito();
    // Sin mensaje - los checkboxes muestran el cambio
  }

  /**
   * Deseleccionar todas las cuotas del carrito
   * 
   * Desmarca todas las cuotas (el total quedará en $0).
   */
  deseleccionarTodas(): void {
    this.carritoService.deseleccionarTodas();
    this.actualizarCarrito();
    // Sin mensaje - los checkboxes muestran el cambio
  }

  /**
   * Procesar pago de cuotas seleccionadas
   * 
   * Simula el proceso de pago de las cuotas marcadas.
   * En una implementación real, aquí se integraría con WebPay u otra pasarela.
   * 
   * Las cuotas pagadas se marcan como 'pagada' y se eliminan del carrito.
   */
  procesarPago(): void {
    if (this.cantidadSeleccionados === 0) {
      alert('⚠️ Debes seleccionar al menos una cuota para pagar');
      return;
    }

    // IMPORTANTE: Guardar valores ANTES de procesar el pago
    const totalAPagar = this.total;
    const cantidadCuotas = this.cantidadSeleccionados;

    // Confirmar pago
    const confirmar = confirm(
      `¿Confirmar pago de ${cantidadCuotas} cuota(s) por $${totalAPagar.toLocaleString()}?\n\n` +
      `Este pago será procesado mediante transferencia bancaria.`
    );

    if (!confirmar) {
      return;
    }

    this.procesandoPago = true;

    // Simular procesamiento de pago (en producción sería llamada a API/WebPay)
    setTimeout(() => {
      const cuotasPagadas = this.carritoService.procesarPago('Transferencia');
      
      // Guardar el pago en el historial
      this.guardarPagoEnHistorial(cuotasPagadas, totalAPagar);
      
      this.procesandoPago = false;
      this.actualizarCarrito();
      this.cargarCuotasDisponibles(); // Actualizar cuotas disponibles
      
      // ÚNICO MENSAJE: Pago exitoso
      alert(
        `✅ Pago exitoso de ${cantidadCuotas} cuota(s).\n\n` +
        `Total pagado: $${totalAPagar.toLocaleString()}\n\n` +
        `Las cuotas pagadas ya no aparecerán en tu lista de pendientes.`
      );
      
      console.log('Cuotas pagadas:', cuotasPagadas);
    }, 1500);
  }

  /**
   * Guardar pago en el historial de pagos
   * 
   * Registra el pago realizado en localStorage para que aparezca
   * en el historial de pagos del usuario.
   * 
   * @param {Cuota[]} cuotasPagadas - Array de cuotas que se pagaron
   * @param {number} totalPagado - Monto total pagado
   */
  private guardarPagoEnHistorial(cuotasPagadas: Cuota[], totalPagado: number): void {
    const usuario = this.authService.getCurrentUser();
    if (!usuario) return;

    // Obtener historial actual
    const pagosStr = localStorage.getItem('pagos');
    const pagos = pagosStr ? JSON.parse(pagosStr) : [];

    // Crear registro de pago por cada cuota
    cuotasPagadas.forEach(cuota => {
      const pago = {
        id: Date.now() + Math.random(), // ID único
        cuotaId: cuota.id, // ID de la cuota para filtrarla después
        fecha: new Date().toISOString(),
        monto: cuota.monto,
        mes: cuota.mes,
        anio: cuota.anio,
        pasaje: usuario.pasaje,
        casa: usuario.casa,
        email: usuario.email,
        metodoPago: 'Transferencia',
        estado: 'pagado'
      };
      
      pagos.push(pago);
    });

    // Guardar en localStorage
    localStorage.setItem('pagos', JSON.stringify(pagos));
    console.log('Pagos guardados en historial:', cuotasPagadas.length);
  }

  /**
   * Verificar si una cuota está en el carrito
   * 
   * Usado para mostrar el botón correcto (Agregar vs Quitar)
   * 
   * @param {number} cuotaId - ID de la cuota
   * @returns {boolean} True si la cuota está en el carrito
   */
  estaEnCarrito(cuotaId: number): boolean {
    return this.carritoService.estaEnCarrito(cuotaId);
  }

  /**
   * Obtener clase CSS según estado de la cuota
   * 
   * Retorna la clase de Bootstrap para mostrar el badge del estado.
   * 
   * @param {Cuota} cuota - Cuota
   * @returns {string} Nombre de clase CSS de Bootstrap
   */
  obtenerClaseEstado(cuota: Cuota): string {
    switch (cuota.estado) {
      case 'pagada':
        return 'badge bg-success';
      case 'pendiente':
        return 'badge bg-warning text-dark';
      case 'vencida':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  /**
   * Vaciar el carrito completo
   * 
   * Elimina todas las cuotas del carrito después de confirmar.
   */
  vaciarCarrito(): void {
    const confirmar = confirm(
      '¿Estás seguro de vaciar el carrito?\n\n' +
      'Se eliminarán todas las cuotas agregadas.'
    );
    
    if (confirmar) {
      this.carritoService.vaciarCarrito();
      this.actualizarCarrito();
      // Sin mensaje - el carrito se vacía visualmente
    }
  }

  /**
   * Volver al dashboard
   * 
   * Navega de regreso al dashboard del residente.
   */
  volver(): void {
    this.router.navigate(['/usuario/dashboard']);
  }
}
