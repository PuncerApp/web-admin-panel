import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header-component',
  standalone: true,
  templateUrl: './header-component.html',
  styleUrl: './header-component.scss',
})
export class HeaderComponent {

  constructor(private auth: AuthService) {}
  logout() {
    this.auth.logout();
  }

}
