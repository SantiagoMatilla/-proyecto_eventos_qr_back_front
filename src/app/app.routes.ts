import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Ejemplo de ruta pública (Inicio / Catálogo de eventos)
  {
    path: '',
    loadComponent: () =>
      import('./features/eventos/pages/evento-list/evento-list.component').then(
        (m) => m.EventoListComponent,
      ),
  },

  // Rutas de Autenticación (Protegidas con noAuthGuard para que no entre gente ya logueada)
  {
    path: 'login',
    canActivate: [noAuthGuard],
    loadComponent: () =>
      import('./features/auth/pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'registro',
    canActivate: [noAuthGuard],
    loadComponent: () =>
      import('./features/auth/pages/registro/registro.component').then((m) => m.RegistroComponent),
  },

  // Ejemplo de Ruta Privada para Asistentes (Requiere estar logueado)
  {
    path: 'mis-tickets',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/tickets/pages/mis-tickets/mis-tickets.component').then(
        (m) => m.MisTicketsComponent,
      ),
  },

  // Ejemplo de Ruta Privada para Organizadores (Requiere estar logueado Y tener rol ORGANIZADOR o SUPER_ADMIN)
  {
    path: 'organizador/dashboard',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ORGANIZADOR', 'SUPER_ADMIN'] },
    loadComponent: () =>
      import('./features/dashboard/pages/dashboard-org/dashboard-org.component').then(
        (m) => m.DashboardOrgComponent,
      ),
  },

  // Comodín: Cualquier ruta inválida redirige al inicio
  { path: '**', redirectTo: '' },
];
