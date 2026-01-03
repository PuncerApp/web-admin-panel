import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { OwnerService } from '../../core/services/owner.service';
import { Owner } from '../../core/models/owner.model';
import { Subscription, filter } from 'rxjs';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

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
  statusChart: any;
  approvalChart: any;

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
          if (event.urlAfterRedirects === '/admin/dashboard') {
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
      next: (owners) => {
        this.total = owners.length;
        this.pending = owners.filter(o => o.status === 'PENDING').length;
        this.approved = owners.filter(o => o.status === 'APPROVED').length;
        this.rejected = owners.filter(o => o.status === 'REJECTED').length;
        this.cdr.detectChanges();
        this.renderStatusChart();
        this.renderApprovalChart(owners);
      },
      error: (err) => {
        console.error('Failed to load dashboard data', err);
      }
    });
  }

  renderStatusChart() {
    if (this.statusChart) this.statusChart.destroy();

    this.statusChart = new Chart('statusChart', {
      type: 'doughnut',
      data: {
        labels: ['Pending', 'Approved', 'Rejected'],
        datasets: [{
          data: [this.pending, this.approved, this.rejected],
          backgroundColor: ['#fbbf24', '#22c55e', '#ef4444']
        }]
      }
    });
  }

  renderApprovalChart(owners: any[]) {
    if (this.approvalChart) this.approvalChart.destroy();

    const approvedByDate: Record<string, number> = {};

    owners
      .filter(o => o.status === 'APPROVED')
      .forEach(o => {
        const date = new Date(o.createdAt).toLocaleDateString();
        approvedByDate[date] = (approvedByDate[date] || 0) + 1;
      });

    this.approvalChart = new Chart('approvalChart', {
      type: 'bar',
      data: {
        labels: Object.keys(approvedByDate),
        datasets: [{
          label: 'Approved Shops',
          data: Object.values(approvedByDate),
          backgroundColor: '#22c55e'
        }]
      }
    });
  }
}
