export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  avatarUrl?: string;
  rol: string;
}
