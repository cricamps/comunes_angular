/**
 * Interfaz que representa a un residente de una casa
 */
export interface Residente {
  nombre: string;
  rut: string;
  email: string;
  telefono: string;
}

/**
 * Interfaz que representa una casa de la comunidad
 */
export interface Casa {
  id: number;
  numeroCasa: string;
  pasaje: string;
  direccion: string;
  residente: Residente;
  metrosCuadrados: number;
  cantidadHabitantes: number;
  activa: boolean;
}
