import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-owner-layout',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './owner-layout.html',
  styleUrls: ['./owner-layout.scss']
})
export class OwnerLayoutComponent {
  constructor(private auth: AuthService) {}
  logout() {
    this.auth.logout();
  }
}
