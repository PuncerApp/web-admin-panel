import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-access-denied',
  templateUrl: './access-denied.html',
  styleUrls: ['./access-denied.scss']
})
export class AccessDeniedComponent {

  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
