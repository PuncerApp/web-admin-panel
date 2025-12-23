import { Component, OnInit } from '@angular/core';
import { OwnerService } from '../../core/services/owner.service';
import { Owner } from '../../core/models/owner.model';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent {

  total = 0;
  pending = 0;
  approved = 0;
  rejected = 0;

  constructor(private ownerService: OwnerService) {}

  ngOnInit() {
    this.ownerService.getOwners().subscribe((owners: Owner[]) => {
      this.total = owners.length;
      this.pending = owners.filter(o => o.status === 'PENDING').length;
      this.approved = owners.filter(o => o.status === 'APPROVED').length;
      this.rejected = owners.filter(o => o.status === 'REJECTED').length;
    });
  }
}
