import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Inicio / Catálogo de eventos
  {
    path: '',
    loadComponent: () =>
      import('./features/eventos/pages/evento-list/evento-list.component').then(
        (m) => m.EventoListComponent,
      ),
  },

  {
    path: 'eventos/:id',
    loadComponent: () =>
      import('./features/eventos/pages/evento-detail/evento-detail.component').then(
        (m) => m.EventoDetailComponent,
      ),
  },

  // Rutas de Autenticación
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

  {
    path: 'forgot-password',
    canActivate: [noAuthGuard],
    loadComponent: () =>
      import('./features/auth/pages/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent,
      ),
  },
  {
    path: 'reset-password',
    canActivate: [noAuthGuard],
    loadComponent: () =>
      import('./features/auth/pages/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent,
      ),
  },

  // Ruta Privada para Asistentes
  {
    path: 'mis-tickets',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/tickets/pages/mis-tickets/mis-tickets.component').then(
        (m) => m.MisTicketsComponent,
      ),
  },

  // Ruta Privada para Organizadores
  {
    path: 'organizador/dashboard',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ORGANIZADOR', 'SUPER_ADMIN'] },
    loadComponent: () =>
      import('./features/dashboard/pages/dashboard-org/dashboard-org.component').then(
        (m) => m.DashboardOrgComponent,
      ),
  },

  {
    path: 'organizador/mis-eventos',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ORGANIZADOR'] },
    loadComponent: () =>
      import('./features/eventos/pages/mis-eventos/mis-eventos.component').then(
        (m) => m.MisEventosComponent,
      ),
  },

  {
    path: 'organizador/eventos/nuevo',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ORGANIZADOR', 'SUPER_ADMIN'] },
    loadComponent: () =>
      import('./features/eventos/pages/evento-form/evento-form.component').then(
        (m) => m.EventoFormComponent,
      ),
  },
  {
    path: 'organizador/eventos/:id/editar',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ORGANIZADOR', 'SUPER_ADMIN'] },
    loadComponent: () =>
      import('./features/eventos/pages/evento-form/evento-form.component').then(
        (m) => m.EventoFormComponent,
      ),
  },

  //Ruta del perfil
  {
    path: 'perfil',
    loadComponent: () =>
      import('./features/asistente/perfil/perfil.component').then((m) => m.PerfilComponent),
    canActivate: [authGuard],
  },

  // Comodín
  { path: '**', redirectTo: '' },
];
