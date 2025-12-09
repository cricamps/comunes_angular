import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Rutas públicas
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'registro',
    loadComponent: () => import('./features/auth/registro/registro.component').then(m => m.RegistroComponent)
  },
  {
    path: 'recuperar',
    loadComponent: () => import('./features/auth/recuperar/recuperar.component').then(m => m.RecuperarComponent)
  },

  // Rutas Admin
  {
    path: 'admin',
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'gestionar-gastos',
        loadComponent: () => import('./features/admin/gestionar-gastos/gestionar-gastos.component').then(m => m.GestionarGastosComponent)
      },
      {
        path: 'gestionar-residentes',
        loadComponent: () => import('./features/admin/gestionar-residentes/gestionar-residentes.component').then(m => m.GestionarResidentesComponent)
      },
      {
        path: 'registrar-pagos',
        loadComponent: () => import('./features/admin/registrar-pagos/registrar-pagos.component').then(m => m.RegistrarPagosComponent)
      },
      {
        path: 'solicitudes',
        loadComponent: () => import('./features/admin/solicitudes/solicitudes.component').then(m => m.SolicitudesComponent)
      },
      {
        path: 'reportes',
        loadComponent: () => import('./features/admin/reportes/reportes.component').then(m => m.ReportesComponent)
      },
      {
        path: 'configuracion',
        loadComponent: () => import('./features/admin/configuracion/configuracion.component').then(m => m.ConfiguracionComponent)
      },
      {
        path: 'lista-casas',
        loadComponent: () => import('./features/admin/lista-casas/lista-casas.component').then(m => m.ListaCasasComponent)
      },
      {
        path: 'estadisticas-gastos',
        loadComponent: () => import('./features/admin/estadisticas-gastos/estadisticas-gastos.component').then(m => m.EstadisticasGastosComponent)
      }
    ]
  },

  // Rutas Usuario
  {
    path: 'usuario',
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/usuario/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'mis-gastos',
        loadComponent: () => import('./features/usuario/mis-gastos/mis-gastos.component').then(m => m.MisGastosComponent)
      },
      {
        path: 'historial-pagos',
        loadComponent: () => import('./features/usuario/historial-pagos/historial-pagos.component').then(m => m.HistorialPagosComponent)
      },
      {
        path: 'realizar-pago',
        loadComponent: () => import('./features/usuario/realizar-pago/realizar-pago.component').then(m => m.RealizarPagoComponent)
      }
    ]
  },

  // Rutas compartidas
  {
    path: 'perfil',
    canActivate: [authGuard],
    loadComponent: () => import('./features/shared/perfil/perfil.component').then(m => m.PerfilComponent)
  },
  {
    path: 'detalle-gasto',
    canActivate: [authGuard],
    loadComponent: () => import('./features/shared/detalle-gasto/detalle-gasto.component').then(m => m.DetalleGastoComponent)
  },
  {
    path: 'info-financiera',
    canActivate: [authGuard],
    loadComponent: () => import('./features/shared/info-financiera/info-financiera.component').then(m => m.InfoFinancieraComponent)
  },

  // Ruta 404
  {
    path: '**',
    redirectTo: '/login'
  }
];
