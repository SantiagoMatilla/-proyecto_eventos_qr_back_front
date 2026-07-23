export interface EventoRequest {
  titulo: string;
  descripcion: string;
  categoriaId: number;
  fechaInicio: string;
  fechaFin: string;
  lugar: string;
  direccion?: string;
  ciudad?: string;
  codigoPostal?: string;
  aforoMaximo: number;
  precio: number;
  tipoAcceso: 'PUBLICO' | 'PRIVADO';
  codigoAcceso?: string;
}
