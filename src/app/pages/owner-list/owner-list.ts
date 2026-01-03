import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { OwnerService } from '../../core/services/owner.service';
import { Owner } from '../../core/models/owner.model';
import { CommonModule } from '@angular/common';
import { Subscription, filter } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './owner-list.html',
  styleUrls: ['./owner-list.scss'], 
})
export class OwnerListComponent implements OnInit, OnDestroy {

  owners: Owner[] = [];
  private subscriptions: Subscription[] = [];

  constructor(
    private ownerService: OwnerService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadOwners();
    // Subscribe to data updates from other components
    this.subscriptions.push(
      this.ownerService.onDataUpdated.subscribe(() => {
        console.log(this.owners)
        this.loadOwners();
      })
    );
    // Refresh when navigating to owners route
    this.subscriptions.push(
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe((event: any) => {
          if (event.urlAfterRedirects === '/admin/owners') {
            this.loadOwners();
          }
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadOwners() {
    this.ownerService.getOwners().subscribe({
      next: (res) => {
        console.log('API Response:', res);
        console.log('Response type:', typeof res);
        console.log('Is array:', Array.isArray(res));
        
        // Handle different response formats
        let ownersData: Owner[] = [];
        if (Array.isArray(res)) {
          ownersData = res;
        } else if (res && typeof res === 'object' && 'data' in res && Array.isArray((res as any).data)) {
          ownersData = (res as any).data;
        } else if (res && typeof res === 'object' && 'owners' in res && Array.isArray((res as any).owners)) {
          ownersData = (res as any).owners;
        }
        
        this.owners = [...ownersData];
        console.log('Owners array:', this.owners);
        console.log('Owners length:', this.owners.length);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load owners', err);
        console.error('Error details:', {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          error: err.error,
          url: err.url
        });
        
        // Try to extract error message
        let errorMsg = 'Failed to load owners. ';
        if (err.error) {
          if (typeof err.error === 'string') {
            errorMsg += err.error;
          } else if (err.error.message) {
            errorMsg += err.error.message;
          }
        }
        alert(errorMsg);
      }
    });
  }

  approve(id: number) {
    this.ownerService.updateStatus(id, 'APPROVED').subscribe({
      next: (updatedOwner) => {
        // Update the owner in the local array immediately
        const index = this.owners.findIndex(o => o.id === id);
        if (index !== -1) {
          this.owners[index] = updatedOwner;
          this.owners = [...this.owners]; // Create new array reference
        }
        this.cdr.detectChanges();
        this.ownerService.notifyDataUpdated();
        alert('Owner Approved');
      },
      error: (err) => {
        console.error('Failed to approve owner', err);
        alert('Failed to approve owner. Please try again.');
      }
    });
  }
  
  reject(id: number) {
    this.ownerService.updateStatus(id, 'REJECTED').subscribe({
      next: (updatedOwner) => {
        // Update the owner in the local array immediately
        const index = this.owners.findIndex(o => o.id === id);
        if (index !== -1) {
          this.owners[index] = updatedOwner;
          this.owners = [...this.owners]; // Create new array reference
        }
        this.cdr.detectChanges();
        this.ownerService.notifyDataUpdated();
        alert('Owner Rejected');
      },
      error: (err) => {
        console.error('Failed to reject owner', err);
        alert('Failed to reject owner. Please try again.');
      }
    });
  }

  delete(id: number) {
    const confirmDelete = confirm('Are you sure you want to delete this owner?');
    if (!confirmDelete) return;
  
    this.ownerService.deleteOwner(id).subscribe({
      next: () => {
        alert('Owner deleted successfully');
        this.owners = [...this.owners.filter(o => o.id !== id)];
        this.cdr.detectChanges();
        this.ownerService.notifyDataUpdated();
      },
      error: (err) => {
        console.error('Delete failed', err);
        alert('Failed to delete owner');
      }
    });
  }
}
