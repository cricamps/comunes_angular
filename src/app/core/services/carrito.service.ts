import { Injectable } from '@angular/core';
import { Cuota, ItemCarrito } from '../../models/cuota.model';

/**
 * Servicio de Carrito de Pagos
 * 
 * Gestiona el carrito de cuotas pendientes que el residente desea pagar.
 * Permite agregar cuotas, eliminarlas, calcular totales y procesar pagos.
 * 
 * @example
 * ```typescript
 * constructor(private carritoService: CarritoService) {}
 * 
 * agregarCuota() {
 *   this.carritoService.agregarCuota(cuota);
 *   const total = this.carritoService.calcularTotal();
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  
  private items: ItemCarrito[] = [];
  private readonly STORAGE_KEY = 'carritoGastosComunes';

  constructor() {
    this.cargarCarrito();
  }

  /**
   * Cargar carrito desde localStorage
   * 
   * Intenta cargar el carrito guardado previamente.
   * Si no existe, inicializa con array vacío.
   * 
   * @private
   */
  private cargarCarrito(): void {
    const carritoStorage = localStorage.getItem(this.STORAGE_KEY);
    if (carritoStorage) {
      try {
        this.items = JSON.parse(carritoStorage);
        console.log('Carrito cargado:', this.items.length, 'items');
      } catch (error) {
        console.error('Error al cargar carrito:', error);
        this.items = [];
      }
    }
  }

  /**
   * Guardar carrito en localStorage
   * 
   * Persiste el estado actual del carrito.
   * 
   * @private
   */
  private guardarCarrito(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items));
    console.log('Carrito guardado');
  }

  /**
   * Agregar una cuota al carrito
   * 
   * Agrega una cuota si no existe ya en el carrito.
   * La cuota se agrega como seleccionada por defecto.
   * 
   * @param {Cuota} cuota - Cuota a agregar
   * @returns {boolean} True si se agregó, false si ya existía
   * 
   * @example
   * ```typescript
   * const agregado = this.carritoService.agregarCuota(cuota);
   * if (agregado) {
   *   this.mostrarMensaje('Cuota agregada al carrito');
   * }
   * ```
   * 
   * @usageNotes
   * - Solo se pueden agregar cuotas pendientes
   * - No se permiten duplicados
   * - El carrito se guarda automáticamente en localStorage
   */
  agregarCuota(cuota: Cuota): boolean {
    // Verificar si ya existe
    const existe = this.items.some(item => item.cuota.id === cuota.id);
    
    if (existe) {
      console.log('La cuota ya está en el carrito');
      return false;
    }

    // Agregar al carrito
    this.items.push({
      cuota: cuota,
      seleccionada: true
    });

    this.guardarCarrito();
    console.log('Cuota agregada al carrito:', cuota.mes, cuota.año);
    return true;
  }

  /**
   * Eliminar una cuota del carrito
   * 
   * Remueve la cuota especificada del carrito.
   * 
   * @param {number} cuotaId - ID de la cuota a eliminar
   * 
   * @example
   * ```typescript
   * this.carritoService.eliminarCuota(1);
   * ```
   */
  eliminarCuota(cuotaId: number): void {
    const indiceInicial = this.items.length;
    this.items = this.items.filter(item => item.cuota.id !== cuotaId);
    
    if (this.items.length < indiceInicial) {
      this.guardarCarrito();
      console.log('Cuota eliminada del carrito:', cuotaId);
    }
  }

  /**
   * Alternar selección de una cuota
   * 
   * Cambia el estado de selección de una cuota.
   * Solo las cuotas seleccionadas se incluyen en el total.
   * 
   * @param {number} cuotaId - ID de la cuota
   * 
   * @example
   * ```typescript
   * this.carritoService.toggleSeleccion(1);
   * const total = this.carritoService.calcularTotal(); // Solo cuotas seleccionadas
   * ```
   */
  toggleSeleccion(cuotaId: number): void {
    const item = this.items.find(i => i.cuota.id === cuotaId);
    if (item) {
      item.seleccionada = !item.seleccionada;
      this.guardarCarrito();
      console.log('Selección cambiada:', cuotaId, '→', item.seleccionada);
    }
  }

  /**
   * Obtener todos los items del carrito
   * 
   * @returns {ItemCarrito[]} Array con todos los items
   * 
   * @example
   * ```typescript
   * const items = this.carritoService.obtenerItems();
   * console.log('Items en carrito:', items.length);
   * ```
   */
  obtenerItems(): ItemCarrito[] {
    return [...this.items];
  }

  /**
   * Obtener items seleccionados
   * 
   * @returns {ItemCarrito[]} Solo los items marcados como seleccionados
   */
  obtenerItemsSeleccionados(): ItemCarrito[] {
    return this.items.filter(item => item.seleccionada);
  }

  /**
   * Calcular el total a pagar
   * 
   * Suma los montos de todas las cuotas SELECCIONADAS.
   * Este es el monto que el residente debe pagar.
   * 
   * @returns {number} Total a pagar
   * 
   * @example
   * ```typescript
   * const total = this.carritoService.calcularTotal();
   * console.log('Total a pagar: $' + total);
   * ```
   * 
   * @usageNotes
   * - Solo suma cuotas seleccionadas
   * - El total se actualiza automáticamente al cambiar selecciones
   * - Usado en CarritoComponent para mostrar el monto final
   */
  calcularTotal(): number {
    const total = this.items
      .filter(item => item.seleccionada)
      .reduce((sum, item) => sum + item.cuota.monto, 0);
    
    return Math.round(total * 100) / 100; // Redondear a 2 decimales
  }

  /**
   * Obtener cantidad de items en el carrito
   * 
   * @returns {number} Número total de cuotas en el carrito
   */
  obtenerCantidad(): number {
    return this.items.length;
  }

  /**
   * Obtener cantidad de items seleccionados
   * 
   * @returns {number} Número de cuotas seleccionadas
   */
  obtenerCantidadSeleccionados(): number {
    return this.items.filter(item => item.seleccionada).length;
  }

  /**
   * Vaciar el carrito completamente
   * 
   * Elimina todos los items del carrito.
   * 
   * @example
   * ```typescript
   * // Después de procesar el pago
   * this.carritoService.vaciarCarrito();
   * ```
   */
  vaciarCarrito(): void {
    this.items = [];
    this.guardarCarrito();
    console.log('Carrito vaciado');
  }

  /**
   * Procesar pago de cuotas seleccionadas
   * 
   * Marca las cuotas seleccionadas como pagadas y las elimina del carrito.
   * En una implementación real, aquí se integraría con una pasarela de pago.
   * 
   * @param {string} metodoPago - Método de pago usado (ej: 'Transferencia', 'WebPay')
   * @returns {Cuota[]} Array con las cuotas que fueron pagadas
   * 
   * @example
   * ```typescript
   * const cuotasPagadas = this.carritoService.procesarPago('Transferencia');
   * console.log('Cuotas pagadas:', cuotasPagadas.length);
   * ```
   */
  procesarPago(metodoPago: string): Cuota[] {
    const cuotasPagadas: Cuota[] = [];
    const itemsSeleccionados = this.obtenerItemsSeleccionados();

    // Marcar como pagadas
    itemsSeleccionados.forEach(item => {
      item.cuota.estado = 'pagada';
      item.cuota.fechaPago = new Date();
      item.cuota.metodoPago = metodoPago;
      cuotasPagadas.push(item.cuota);
    });

    // Eliminar del carrito
    this.items = this.items.filter(item => !item.seleccionada);
    this.guardarCarrito();

    console.log('Pago procesado:', cuotasPagadas.length, 'cuotas');
    return cuotasPagadas;
  }

  /**
   * Verificar si una cuota está en el carrito
   * 
   * @param {number} cuotaId - ID de la cuota
   * @returns {boolean} True si la cuota está en el carrito
   */
  estaEnCarrito(cuotaId: number): boolean {
    return this.items.some(item => item.cuota.id === cuotaId);
  }

  /**
   * Seleccionar todas las cuotas
   * 
   * Marca todas las cuotas del carrito como seleccionadas.
   */
  seleccionarTodas(): void {
    this.items.forEach(item => item.seleccionada = true);
    this.guardarCarrito();
    console.log('Todas las cuotas seleccionadas');
  }

  /**
   * Deseleccionar todas las cuotas
   * 
   * Desmarca todas las cuotas del carrito.
   */
  deseleccionarTodas(): void {
    this.items.forEach(item => item.seleccionada = false);
    this.guardarCarrito();
    console.log('Todas las cuotas deseleccionadas');
  }
}
