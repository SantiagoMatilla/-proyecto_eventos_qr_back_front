import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return true; // Si no está logueado, puede ver el login/registro
  }

  // Si ya tiene sesión activa, lo mandamos a la raíz
  router.navigate(['/']);
  return false;
};
