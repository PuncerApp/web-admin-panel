import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const ownerGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const role = auth.getUserRole();
  console.log('OWNER GUARD ROLE:', role);

  if (role === 'OWNER') {
    return true; // ✅ THIS WAS MISSING / WRONG
  }

  router.navigate(['/access-denied']);
  return false;
};