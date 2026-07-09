import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error) => {
      // Solo forzamos logout+redirect si el usuario YA tenía sesión iniciada
      // (un 401 al intentar loguearse no es lo mismo que una sesión caducada)
      if (error.status === 401 && authService.isLoggedIn()) {
        console.log("Error interceptor");
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    }),
  );
};
