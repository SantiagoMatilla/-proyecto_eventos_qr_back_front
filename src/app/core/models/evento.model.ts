export type TipoAcceso = 'PUBLICO' | 'PRIVADO';
export type EstadoEvento = 'BORRADOR' | 'PUBLICADO' | 'CANCELADO' | 'FINALIZADO';

export interface Evento {
  id: number;
  titulo: string;
  descripcion: string;
  categoriaId: number;
  categoriaNombre: string;
  organizadorId: number;
  organizadorNombre: string;
  fechaInicio: string;
  fechaFin: string;
  lugar: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  aforoMaximo: number;
  precio: number;
  imagenUrl: string | null;
  tipoAcceso: TipoAcceso;
  estado: EstadoEvento;
  plazasDisponibles: number;
  createdAt: string;
}
