import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/usuarios';

  getPerfil(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/me`);
  }

  actualizarPerfil(datos: {
    nombre: string;
    apellido: string;
    telefono: string;
  }): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/me`, datos);
  }

  cambiarPassword(datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/me/password`, datos);
  }

  subirAvatar(file: File): Observable<Usuario> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Usuario>(`${this.apiUrl}/me/avatar`, formData);
  }
}
