import { Component, OnInit } from '@angular/core';
import { OwnerService } from '../../core/services/owner.service';
import { Owner } from '../../core/models/owner.model';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './owner-list.html',
  styleUrls: ['./owner-list.scss'], 
})
export class OwnerListComponent {

  owners: Owner[] = [];

  constructor(private ownerService: OwnerService) {}

  ngOnInit() {
    this.ownerService.getOwners().subscribe(res => {
      this.owners = res;
    });
  }

  approve(id: number) {
    this.ownerService.updateStatus(id, 'APPROVED');
    alert('Owner Approved');
  }
  
  reject(id: number) {
    this.ownerService.updateStatus(id, 'REJECTED');
    alert('Owner Rejected');
  }
}
