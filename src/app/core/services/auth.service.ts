import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private storageService = inject(StorageService);
  private apiUrl = 'http://localhost:8080/api/auth';

  // Signal para almacenar el usuario actual en memoria de manera reactiva
  currentUser = signal<any | null>(this.storageService.getUser());

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        // Guardamos los tokens y los datos de usuario que provienen de tu AuthResponse
        this.storageService.saveTokens(res.accessToken, res.refreshToken);
        const user = { email: res.email, rol: res.rol };
        this.storageService.saveUser(user);
        this.currentUser.set(user);
      }),
    );
  }

  registrar(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData).pipe(
      tap((res) => {
        this.storageService.saveTokens(res.accessToken, res.refreshToken);
        const user = { email: res.email, rol: res.rol };
        this.storageService.saveUser(user);
        this.currentUser.set(user);
      }),
    );
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
}
