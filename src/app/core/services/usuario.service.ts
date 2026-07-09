import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/usuarios';

  getPerfil(): Observable<Usuario> {
    return this.http
      .get<ApiResponse<Usuario>>(`${this.apiUrl}/me?t=${new Date().getTime()}`)
      .pipe(map((res) => res.data));
  }

  actualizarPerfil(datos: {
    nombre: string;
    apellido: string;
    telefono: string;
  }): Observable<Usuario> {
    return this.http
      .put<ApiResponse<Usuario>>(`${this.apiUrl}/me`, datos)
      .pipe(map((res) => res.data));
  }

  cambiarPassword(datos: any): Observable<any> {
    return this.http
      .put<ApiResponse<any>>(`${this.apiUrl}/me/password`, datos)
      .pipe(map((res) => res.data));
  }

  subirAvatar(file: File): Observable<Usuario> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http
      .post<ApiResponse<Usuario>>(`${this.apiUrl}/me/avatar`, formData)
      .pipe(map((res) => res.data));
  }
}
