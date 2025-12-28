import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { OwnerService } from '../../core/services/owner.service';
import { Owner } from '../../core/models/owner.model';
import { Subscription, filter } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {

  total: number = 0;
  pending: number = 0;
  approved: number = 0;
  rejected: number = 0;
  private subscriptions: Subscription[] = [];

  constructor(
    private ownerService: OwnerService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    // Subscribe to data updates
    this.subscriptions.push(
      this.ownerService.onDataUpdated.subscribe(() => {
        this.loadDashboardData();
      })
    );
    // Refresh when navigating to dashboard
    this.subscriptions.push(
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe((event: any) => {
          if (event.url === '/dashboard' || event.urlAfterRedirects === '/dashboard') {
            this.loadDashboardData();
          }
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadDashboardData(): void {
    this.ownerService.getOwners().subscribe({
      next: (owners: Owner[]) => {
        this.total = owners.length;
        this.pending = owners.filter(o => o.status === 'PENDING').length;
        this.approved = owners.filter(o => o.status === 'APPROVED').length;
        this.rejected = owners.filter(o => o.status === 'REJECTED').length;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load dashboard data', err);
      }
    });
  }
}
