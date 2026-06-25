import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly ACCESS_TOKEN = 'access_token';
  private readonly REFRESH_TOKEN = 'refresh_token';
  private readonly USER_DATA = 'user_data';

  saveTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.ACCESS_TOKEN, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN, refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  saveUser(user: any): void {
    localStorage.setItem(this.USER_DATA, JSON.stringify(user));
  }

  getUser(): any | null {
    const user = localStorage.getItem(this.USER_DATA);
    return user ? JSON.parse(user) : null;
  }

  clear(): void {
    localStorage.clear();
  }
}
