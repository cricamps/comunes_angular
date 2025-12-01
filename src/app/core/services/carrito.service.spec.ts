import { TestBed } from '@angular/core/testing';
import { CarritoService } from './carrito.service';
import { Cuota } from '../../models/cuota.model';

describe('CarritoService - Cálculo correcto del total', () => {
  let service: CarritoService;

  // Cuotas de ejemplo para los tests
  const cuota1: Cuota = {
    id: 1,
    mes: 'Enero',
    anio: 2024,
    monto: 5000,
    estado: 'pendiente',
    fechaVencimiento: new Date('2024-01-31'),
    pasaje: '8651',
    casa: 'A'
  };

  const cuota2: Cuota = {
    id: 2,
    mes: 'Febrero',
    anio: 2024,
    monto: 5000,
    estado: 'pendiente',
    fechaVencimiento: new Date('2024-02-29'),
    pasaje: '8651',
    casa: 'A'
  };

  const cuota3: Cuota = {
    id: 3,
    mes: 'Marzo',
    anio: 2024,
    monto: 5000,
    estado: 'pendiente',
    fechaVencimiento: new Date('2024-03-31'),
    pasaje: '8651',
    casa: 'A'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarritoService);
    
    // Limpiar localStorage antes de cada test
    localStorage.clear();
    
    // Vaciar el carrito
    service.vaciarCarrito();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debe calcular correctamente el total con una cuota', () => {
    // Arrange - Preparar
    service.agregarCuota(cuota1);

    // Act - Ejecutar
    const total = service.calcularTotal();

    // Assert - Verificar
    expect(total).toBe(5000);
  });

  it('debe calcular correctamente el total con múltiples cuotas', () => {
    // Arrange - Preparar
    service.agregarCuota(cuota1); // $5,000
    service.agregarCuota(cuota2); // $5,000
    service.agregarCuota(cuota3); // $5,000

    // Act - Ejecutar
    const total = service.calcularTotal();

    // Assert - Verificar
    expect(total).toBe(15000); // 3 × $5,000 = $15,000
  });

  it('debe recalcular el total correctamente al cambiar la cantidad', () => {
    // Arrange - Preparar
    service.agregarCuota(cuota1);
    service.agregarCuota(cuota2);
    
    // Act 1 - Primera ejecución
    const total1 = service.calcularTotal();
    expect(total1).toBe(10000); // 2 × $5,000
    
    // Act 2 - Agregar otra cuota (cambiar cantidad)
    service.agregarCuota(cuota3);
    const total2 = service.calcularTotal();

    // Assert - Verificar que se recalculó
    expect(total2).toBe(15000); // 3 × $5,000
    expect(total2).not.toBe(total1);
    expect(total2).toBeGreaterThan(total1);
  });

  it('debe recalcular el total al eliminar una cuota', () => {
    // Arrange
    service.agregarCuota(cuota1);
    service.agregarCuota(cuota2);
    service.agregarCuota(cuota3);
    
    expect(service.calcularTotal()).toBe(15000);

    // Act - Eliminar una cuota
    service.eliminarCuota(cuota2.id);

    // Assert
    const nuevoTotal = service.calcularTotal();
    expect(nuevoTotal).toBe(10000); // 2 × $5,000
  });

  it('debe calcular solo cuotas seleccionadas', () => {
    // Arrange
    service.agregarCuota(cuota1);
    service.agregarCuota(cuota2);
    service.agregarCuota(cuota3);
    
    // Todas están seleccionadas por defecto
    expect(service.calcularTotal()).toBe(15000);

    // Act - Deseleccionar una cuota
    service.toggleSeleccion(cuota2.id);

    // Assert - Solo debe sumar las seleccionadas
    const totalSeleccionadas = service.calcularTotal();
    expect(totalSeleccionadas).toBe(10000); // Solo cuota1 + cuota3
  });

  it('debe retornar 0 cuando el carrito está vacío', () => {
    // Arrange - Carrito ya está vacío

    // Act
    const total = service.calcularTotal();

    // Assert
    expect(total).toBe(0);
  });

  it('debe retornar 0 cuando ninguna cuota está seleccionada', () => {
    // Arrange
    service.agregarCuota(cuota1);
    service.agregarCuota(cuota2);
    
    // Act - Deseleccionar todas
    service.deseleccionarTodas();
    const total = service.calcularTotal();

    // Assert
    expect(total).toBe(0);
  });

  it('debe mantener consistencia en múltiples cálculos sin cambios', () => {
    // Arrange
    service.agregarCuota(cuota1);
    service.agregarCuota(cuota2);

    // Act - Calcular varias veces
    const total1 = service.calcularTotal();
    const total2 = service.calcularTotal();
    const total3 = service.calcularTotal();

    // Assert - Todos deben ser iguales
    expect(total1).toBe(10000);
    expect(total2).toBe(10000);
    expect(total3).toBe(10000);
    expect(total1).toBe(total2);
    expect(total2).toBe(total3);
  });

  it('debe calcular correctamente después de seleccionar y deseleccionar', () => {
    // Arrange
    service.agregarCuota(cuota1);
    service.agregarCuota(cuota2);
    service.agregarCuota(cuota3);

    // Act & Assert - Secuencia de selecciones
    expect(service.calcularTotal()).toBe(15000); // Todas seleccionadas

    service.toggleSeleccion(cuota1.id); // Deseleccionar cuota1
    expect(service.calcularTotal()).toBe(10000); // Solo cuota2 + cuota3

    service.toggleSeleccion(cuota1.id); // Seleccionar cuota1 de nuevo
    expect(service.calcularTotal()).toBe(15000); // Todas de nuevo

    service.deseleccionarTodas();
    expect(service.calcularTotal()).toBe(0); // Ninguna seleccionada

    service.seleccionarTodas();
    expect(service.calcularTotal()).toBe(15000); // Todas seleccionadas
  });

  it('debe actualizar correctamente al agregar cuotas con diferentes montos', () => {
    // Arrange - Crear cuota con monto diferente
    const cuotaEspecial: Cuota = {
      id: 4,
      mes: 'Abril',
      anio: 2024,
      monto: 7500, // Monto diferente
      estado: 'pendiente',
      fechaVencimiento: new Date('2024-04-30'),
      pasaje: '8651',
      casa: 'A'
    };

    // Act
    service.agregarCuota(cuota1); // $5,000
    service.agregarCuota(cuotaEspecial); // $7,500
    const total = service.calcularTotal();

    // Assert
    expect(total).toBe(12500); // $5,000 + $7,500
  });
});
