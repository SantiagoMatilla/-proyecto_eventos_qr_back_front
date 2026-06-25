import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Leemos los roles permitidos que configuraremos en el archivo de rutas
  const expectedRoles = route.data['roles'] as Array<string>;

  if (!expectedRoles || expectedRoles.length === 0) {
    return true;
  }

  const user = authService.currentUser();

  // Si el usuario existe y su rol está incluido en los roles permitidos de la ruta, pasa
  if (user && expectedRoles.includes(user.rol)) {
    return true;
  }

  // Si no tiene permisos, lo mandamos a la página de inicio
  router.navigate(['/']);
  return false;
};
