import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const storageService = inject(StorageService);
  const token = storageService.getAccessToken();

  // 🕵️‍♂️ TEST 1: ¿El interceptor se despierta cuando pides el perfil?
  console.log('=== [INTERCEPTOR] Intentando interceptar petición a:', req.url);

  // 🕵️‍♂️ TEST 2: ¿Qué está leyendo realmente del Storage?
  console.log('=== [INTERCEPTOR] Token recuperado:', token);

  if (token) {
    console.log('=== [INTERCEPTOR] ¡Token encontrado! Inyectando cabecera...');
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(authReq);
  }

  console.warn('=== [INTERCEPTOR] Ojo: No hay token, la petición se envía limpia.');
  return next(req);
};
