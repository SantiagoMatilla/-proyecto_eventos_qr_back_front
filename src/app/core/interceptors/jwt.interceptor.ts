import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const storageService = inject(StorageService);
  const token = storageService.getAccessToken();

  // Si la petición va dirigida a la carpeta de archivos estáticos (imágenes),
  // enviamos la petición limpia para evitar errores de bloqueo de respuesta.
  if (req.url.includes('/uploads/')) {
    return next(req);
  }

  // Si hay token, inyectamos la cabecera Authorization
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(authReq);
  }

  // Si no hay token, enviamos la petición sin cabeceras
  return next(req);
};
