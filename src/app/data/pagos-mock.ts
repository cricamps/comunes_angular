import { Pago } from '../models/pago.model';

export const PAGOS_MOCK: Pago[] = [
  {
    id: 1,
    email: 'maria@comunes.cl',
    pasaje: '8651',
    casa: 'C',
    monto: 28308, // Total gastos / 13 casas
    mes: '2025-10',
    fechaPago: new Date('2025-10-15T14:30:00'),
    metodoPago: 'transferencia',
    comprobante: 'TRF-20251015-001',
    estado: 'confirmado',
    registradoPor: 'admin@comunes.cl'
  },
  {
    id: 2,
    email: 'pedro@comunes.cl',
    pasaje: '8707',
    casa: 'A',
    monto: 28308,
    mes: '2025-10',
    fechaPago: new Date('2025-10-20T10:15:00'),
    metodoPago: 'efectivo',
    comprobante: 'EFE-20251020-001',
    estado: 'confirmado',
    registradoPor: 'admin@comunes.cl'
  },
  {
    id: 3,
    email: 'maria@comunes.cl',
    pasaje: '8651',
    casa: 'C',
    monto: 28308,
    mes: '2025-11',
    fechaPago: new Date('2025-11-10T09:20:00'),
    metodoPago: 'transferencia',
    comprobante: 'TRF-20251110-001',
    estado: 'confirmado',
    registradoPor: 'admin@comunes.cl'
  }
];

// Funciones helper
export function obtenerPagosPorUsuario(email: string): Pago[] {
  return PAGOS_MOCK.filter(p => p.email === email);
}

export function obtenerPagosPorMes(mes: string): Pago[] {
  return PAGOS_MOCK.filter(p => p.mes === mes);
}

export function obtenerPagosPorEstado(estado: 'pendiente' | 'confirmado' | 'rechazado'): Pago[] {
  return PAGOS_MOCK.filter(p => p.estado === estado);
}

export function obtenerPagosPorPasaje(pasaje: string): Pago[] {
  return PAGOS_MOCK.filter(p => p.pasaje === pasaje);
}

export function verificarPagoUsuarioMes(email: string, mes: string): boolean {
  return PAGOS_MOCK.some(p => p.email === email && p.mes === mes && p.estado === 'confirmado');
}

export function calcularTotalPagadoMes(mes: string): number {
  return PAGOS_MOCK
    .filter(p => p.mes === mes && p.estado === 'confirmado')
    .reduce((sum, p) => sum + p.monto, 0);
}

export function contarPagosConfirmadosMes(mes: string): number {
  return PAGOS_MOCK.filter(p => p.mes === mes && p.estado === 'confirmado').length;
}
