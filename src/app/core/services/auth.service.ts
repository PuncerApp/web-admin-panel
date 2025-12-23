import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private TOKEN_KEY = 'admin_token';

  constructor(private router: Router) {}

  login(username: string, password: string): boolean {
    // TEMP (dummy login – backend later)
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem(this.TOKEN_KEY, 'logged-in');
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/admin-login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }
}
