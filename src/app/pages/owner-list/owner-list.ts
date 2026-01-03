import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import {
  Router,
  NavigationEnd,
  RouterLink
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, filter } from 'rxjs';

import { OwnerService } from '../../core/services/owner.service';
import { Owner } from '../../core/models/owner.model';
import { EnumTitlePipe } from '../../core/pipes/enum-title.pipe';

@Component({
  standalone: true,
  selector: 'app-owner-list',
  imports: [CommonModule, RouterLink, FormsModule, EnumTitlePipe],
  templateUrl: './owner-list.html',
  styleUrls: ['./owner-list.scss'],
})
export class OwnerListComponent implements OnInit, OnDestroy {

  /* ================= DATA ================= */
  owners: Owner[] = [];
  filteredOwners: Owner[] = [];
  paginatedOwners: Owner[] = [];

  searchText = '';
  statusFilter: 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED' = 'ALL';

  /* ================= PAGINATION ================= */
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;

  private subscriptions: Subscription[] = [];

  constructor(
    private ownerService: OwnerService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  /* ================= INIT ================= */
  ngOnInit(): void {
    this.loadOwners();

    this.subscriptions.push(
      this.ownerService.onDataUpdated.subscribe(() => {
        this.loadOwners();
      })
    );

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

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /* ================= LOAD OWNERS ================= */
  loadOwners(): void {
    this.ownerService.getOwners().subscribe({
      next: (res: any) => {
        let ownersData: Owner[] = [];

        if (Array.isArray(res)) {
          ownersData = res;
        } else if (res?.data && Array.isArray(res.data)) {
          ownersData = res.data;
        } else if (res?.owners && Array.isArray(res.owners)) {
          ownersData = res.owners;
        }

        this.owners = [...ownersData];
        this.currentPage = 1; // reset page
        this.applyFilter();
        this.cdr.detectChanges();
      },
      error: () => alert('Failed to load owners')
    });
  }

  /* ================= SEARCH + FILTER ================= */
  applyFilter(): void {
    this.currentPage = 1;
    const text = this.searchText.trim().toLowerCase();

    this.filteredOwners = this.owners.filter(owner => {
      const matchText =
        owner.ownerName.toLowerCase().includes(text) ||
        owner.mobile.includes(text);

      const matchStatus =
        this.statusFilter === 'ALL' ||
        owner.status === this.statusFilter;

      return matchText && matchStatus;
    });

    this.setupPagination();
  }

  /* ================= PAGINATION LOGIC ================= */
  setupPagination(): void {
    this.totalPages = Math.ceil(this.filteredOwners.length / this.pageSize);
    this.updatePaginatedOwners();
  }

  updatePaginatedOwners(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedOwners = this.filteredOwners.slice(start, end);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedOwners();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedOwners();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedOwners();
    }
  }

  /* ================= ACTIONS ================= */
  approve(id: number): void {
    this.ownerService.updateStatus(id, 'APPROVED').subscribe({
      next: (updatedOwner) => {
        this.replaceOwner(updatedOwner);
        this.ownerService.notifyDataUpdated();
      },
      error: () => alert('Approve failed')
    });
  }

  reject(id: number): void {
    this.ownerService.updateStatus(id, 'REJECTED').subscribe({
      next: (updatedOwner) => {
        this.replaceOwner(updatedOwner);
        this.ownerService.notifyDataUpdated();
      },
      error: () => alert('Reject failed')
    });
  }

  delete(id: number): void {
    if (!confirm('Are you sure you want to delete this owner?')) return;

    this.ownerService.deleteOwner(id).subscribe({
      next: () => {
        this.owners = this.owners.filter(o => o.id !== id);
        this.applyFilter();
        this.ownerService.notifyDataUpdated();
      },
      error: () => alert('Delete failed')
    });
  }

  /* ================= HELPERS ================= */
  private replaceOwner(updatedOwner: Owner): void {
    const index = this.owners.findIndex(o => o.id === updatedOwner.id);
    if (index !== -1) {
      this.owners[index] = updatedOwner;
      this.owners = [...this.owners];
    }
    this.applyFilter();
    this.cdr.detectChanges();
  }

  changePageSize(): void {
    this.currentPage = 1;   // reset to first page
    this.setupPagination();
  }
}
