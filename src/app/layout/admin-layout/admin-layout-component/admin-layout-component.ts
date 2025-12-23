import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../header/header-component/header-component';
import { SidebarComponent } from '../../sidebar/sidebar-component/sidebar-component';

@Component({
  selector: 'app-admin-layout-component',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './admin-layout-component.html',
  styleUrl: './admin-layout-component.scss',
})
export class AdminLayoutComponent {

}
