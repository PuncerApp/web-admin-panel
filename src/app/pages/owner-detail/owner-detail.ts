import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OwnerService } from '../../core/services/owner.service';
import { Owner } from '../../core/models/owner.model';
import { Subscription } from 'rxjs';

declare const google: any;

@Component({
  standalone: true,
  selector: 'app-owner-detail',
  imports: [CommonModule],
  templateUrl: './owner-detail.html',
  styleUrls: ['./owner-detail.scss'], 
})
export class OwnerDetailComponent implements OnInit, OnDestroy {

  owner?: Owner;
  map: any;
  private routeSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ownerService: OwnerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.loadOwner(id);
      }
    });
  }

  ngOnDestroy() {
    this.routeSubscription?.unsubscribe();
  }

  loadOwner(id: number) {
    this.ownerService.getOwnerById(id).subscribe({
      next: (owner) => {
        console.log('Owner loaded:', owner);
        this.owner = owner;
        this.cdr.detectChanges();
        // Delay map loading to ensure DOM is ready
        setTimeout(() => {
          if (this.owner) {
            this.loadMap();
          }
        }, 100);
      },
      error: (err) => {
        console.error('Failed to load owner', err);
        console.error('Error details:', {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          error: err.error
        });
        if (err.status === 404) {
          alert('Owner not found. Redirecting to owners list...');
          this.router.navigate(['/owners']);
        } else if (err.status === 0) {
          alert('Cannot connect to server. Please check if the backend is running on http://localhost:8080');
        } else {
          alert('Failed to load owner details. Please try again.');
        }
      }
    });
  }

  loadMap() {
    if (!this.owner) return;

    const mapElement = document.getElementById('map');

    this.map = new google.maps.Map(mapElement, {
      center: {
        lat: this.owner.latitude,
        lng: this.owner.longitude
      },
      zoom: 14
    });

    new google.maps.Marker({
      position: {
        lat: this.owner.latitude,
        lng: this.owner.longitude
      },
      map: this.map,
      title: this.owner.shopName
    });
  }

  approve() {
    if (!this.owner) return;
    this.ownerService.updateStatus(this.owner.id, 'APPROVED')
    .subscribe({
      next: (updatedOwner) => {
        this.owner = updatedOwner;
        this.ownerService.notifyDataUpdated();
        this.router.navigate(['/owners']);
      },
      error: (err) => {
        console.error('Failed to approve owner', err);
        alert('Failed to approve owner. Please try again.');
      }
    });
  }

  reject() {
    if (!this.owner) return;
    this.ownerService.updateStatus(this.owner.id, 'REJECTED')
      .subscribe({
        next: (updatedOwner) => {
          this.owner = updatedOwner;
          this.ownerService.notifyDataUpdated();
          this.router.navigate(['/owners']);
        },
        error: (err) => {
          console.error('Failed to reject owner', err);
          alert('Failed to reject owner. Please try again.');
        }
      });
  }

  back() {
    this.router.navigate(['/owners']);
  }
}
