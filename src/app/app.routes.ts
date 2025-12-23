import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout-component/admin-layout-component';

export const routes: Routes = [
    {
      path: 'admin-login',
      loadComponent: () =>
        import('./pages/admin-login/admin-login')
          .then(m => m.AdminLoginComponent)
    },
    {
      path: '',
      component: AdminLayoutComponent,
      canActivate: [authGuard],
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
          }
      ]
    },
    { path: '**', redirectTo: 'dashboard' }
  ];
