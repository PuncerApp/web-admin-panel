import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { ownerGuard } from './core/guards/owner.guard';
import { authGuard } from './core/guards/auth.guard';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout-component/admin-layout-component';

export const routes: Routes = [

  /* 🔓 LOGIN – PUBLIC */
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/admin-login/admin-login')
        .then(m => m.AdminLoginComponent)
  },

  /* 🔐 ADMIN AREA */
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard')
            .then(m => m.DashboardComponent)
      },
      {
        path: 'owners',
        loadComponent: () =>
          import('./pages/owner-list/owner-list')
            .then(m => m.OwnerListComponent)
      },
      {
        path: 'owners/:id',
        loadComponent: () =>
          import('./pages/owner-detail/owner-detail')
            .then(m => m.OwnerDetailComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  /* 👤 OWNER AREA */
  {
    path: 'owner',
    canActivate: [authGuard, ownerGuard],
    loadComponent: () =>
      import('./layout/owner-layout/owner-layout')
        .then(m => m.OwnerLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/owner-dashboard/owner-dashboard')
            .then(m => m.OwnerDashboardComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  /* 🚫 ACCESS DENIED */
  {
    path: 'access-denied',
    loadComponent: () =>
      import('./pages/access-denied/access-denied')
        .then(m => m.AccessDeniedComponent)
  },

  /* 🔁 FALLBACK */
  { path: '**', redirectTo: 'login' }
];
