import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.html',
  styleUrls: ['./admin-login.scss']
})
export class AdminLoginComponent {

  username = '';
  password = '';
  error = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  login() {
    this.auth.login(this.username, this.password).subscribe({
      next: (token: string) => {
        this.auth.saveToken(token);
  
        const role = this.auth.getUserRole();
        console.log('ROLE FROM TOKEN:', role);  
        if (role === 'ADMIN') {
          this.router.navigate(['/admin']);
        }
        else if (role === 'OWNER') {
          this.router.navigate(['/owner']);
        }
        else {
          this.router.navigate(['/access-denied']);
        }
      },
      error: () => {
        this.error = 'Invalid credentials';
      }
    });
  }
}