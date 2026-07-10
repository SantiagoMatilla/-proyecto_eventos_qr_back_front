import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { StorageService } from './storage.service';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private storageService = inject(StorageService);
  private apiUrl = 'http://localhost:8080/api/auth';

  currentUser = signal<any | null>(this.storageService.getUser());

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/login`, credentials).pipe(
      map((res) => res.data),
      tap((data) => {
        this.storageService.saveTokens(data.accessToken, data.refreshToken);
        const user = { email: data.email, rol: data.rol, avatarUrl: data.avatarUrl };
        this.storageService.saveUser(user);
        this.currentUser.set(user);
      }),
    );
  }

  registrar(userData: any): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/register`, userData).pipe(
      map((res) => res.data),
      tap((data) => {
        this.storageService.saveTokens(data.accessToken, data.refreshToken);
        const user = { email: data.email, rol: data.rol, avatarUrl: data.avatarUrl };
        this.storageService.saveUser(user);
        this.currentUser.set(user);
      }),
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http
      .post<ApiResponse<any>>(`${this.apiUrl}/forgot-password`, { email })
      .pipe(map((res) => res.data));
  }

  resetPassword(datos: { token: string; nuevaPassword: string }): Observable<any> {
    return this.http
      .post<ApiResponse<any>>(`${this.apiUrl}/reset-password`, datos)
      .pipe(map((res) => res.data));
  }

  actualizarDatosUsuario(datosNuevos: any): void {
    const usuarioActual = this.storageService.getUser() || {};
    const usuarioActualizado = { ...usuarioActual, ...datosNuevos };
    this.storageService.saveUser(usuarioActualizado);
    this.currentUser.set(usuarioActualizado);
  }

  logout(): void {
    this.storageService.clear();
    this.currentUser.set(null);
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  hasRole(role: string): boolean {
    return this.currentUser()?.rol === role;
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.includes(this.currentUser()?.rol);
  }
}
