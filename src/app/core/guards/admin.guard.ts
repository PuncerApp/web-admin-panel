import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { inject } from "@angular/core";

export const adminGuard: CanActivateFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);
  
    if (auth.isLoggedIn() && auth.getUserRole() === 'ADMIN') {
      return true;
    }
  
    router.navigate(['/access-denied']);
    return false;
  };