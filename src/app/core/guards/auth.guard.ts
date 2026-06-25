import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true; // Acceso permitido
  }

  // Si no está logueado, lo redirigimos a la pantalla de login
  router.navigate(['/login']);
  return false;
};
