import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Inicio / Catálogo de eventos
  {
    path: '',
    loadComponent: () => import('./features/eventos/pages/evento-list/evento-list.component').then(m => m.EventoListComponent)
  },

  // Rutas de Autenticación
  {
    path: 'login',
    canActivate: [noAuthGuard],
    loadComponent: () => import('./features/auth/pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'registro',
    canActivate: [noAuthGuard],
    loadComponent: () => import('./features/auth/pages/registro/registro.component').then(m => m.RegistroComponent)
  },

  // Ruta Privada para Asistentes
  {
    path: 'mis-tickets',
    canActivate: [authGuard],
    loadComponent: () => import('./features/tickets/pages/mis-tickets/mis-tickets.component').then(m => m.MisTicketsComponent)
  },

  // Ruta Privada para Organizadores
  {
    path: 'organizador/dashboard',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ORGANIZADOR', 'SUPER_ADMIN'] },
    loadComponent: () => import('./features/dashboard/pages/dashboard-org/dashboard-org.component').then(m => m.DashboardOrgComponent)
  },

  // Comodín
  { path: '**', redirectTo: '' }
];
