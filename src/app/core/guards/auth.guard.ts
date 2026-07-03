import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  console.log('=== [GUARD] ¿Usuario logueado?:', authService.isLoggedIn());
  console.log('=== [GUARD] Datos del usuario actual:', authService.currentUser());

  if (authService.isLoggedIn()) {
    console.log('=== [GUARD] ¡Acceso permitido!');
    return true; // Acceso permitido
  }

  // Si no está logueado, lo redirigimos a la pantalla de login
  console.warn('=== [GUARD] ¡Acceso denegado! Redirigiendo a /login...');
  router.navigate(['/login']);
  return false;
};;
