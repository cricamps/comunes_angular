import { Gasto } from '../models/gasto.model';

export const GASTOS_MOCK: Gasto[] = [
  {
    id: 1,
    concepto: 'Mantención de Áreas Verdes',
    categoria: 'Jardinería',
    monto: 65000,
    fecha: new Date('2025-11-01'),
    descripcion: 'Poda y mantención mensual de jardines comunes',
    estado: 'aprobado',
    fechaCreacion: new Date('2025-10-25')
  },
  {
    id: 2,
    concepto: 'Luz de Áreas Comunes',
    categoria: 'Servicios Básicos',
    monto: 48000,
    fecha: new Date('2025-11-01'),
    descripcion: 'Consumo eléctrico de pasillos y zonas comunes',
    estado: 'aprobado',
    fechaCreacion: new Date('2025-10-25')
  },
  {
    id: 3,
    concepto: 'Agua Potable',
    categoria: 'Servicios Básicos',
    monto: 32000,
    fecha: new Date('2025-11-01'),
    descripcion: 'Consumo de agua de áreas comunes',
    estado: 'aprobado',
    fechaCreacion: new Date('2025-10-25')
  },
  {
    id: 4,
    concepto: 'Seguridad',
    categoria: 'Seguridad',
    monto: 120000,
    fecha: new Date('2025-11-01'),
    descripcion: 'Servicio de vigilancia nocturna',
    estado: 'aprobado',
    fechaCreacion: new Date('2025-10-25')
  },
  {
    id: 5,
    concepto: 'Limpieza de Áreas Comunes',
    categoria: 'Limpieza',
    monto: 75000,
    fecha: new Date('2025-11-01'),
    descripcion: 'Servicio de aseo de pasillos y estacionamientos',
    estado: 'aprobado',
    fechaCreacion: new Date('2025-10-25')
  },
  {
    id: 6,
    concepto: 'Gas Común',
    categoria: 'Servicios Básicos',
    monto: 28000,
    fecha: new Date('2025-11-01'),
    descripcion: 'Consumo de gas de áreas comunes',
    estado: 'aprobado',
    fechaCreacion: new Date('2025-10-25')
  }
];

export const TOTAL_CASAS = 13;
export const CASAS_PASAJE_8651 = 6;
export const CASAS_PASAJE_8707 = 7;

export function calcularTotalGastos(): number {
  return GASTOS_MOCK
    .filter(g => g.estado === 'aprobado')
    .reduce((sum, g) => sum + g.monto, 0);
}

export function calcularPromedioGastos(): number {
  const total = calcularTotalGastos();
  return Math.round(total / TOTAL_CASAS);
}
