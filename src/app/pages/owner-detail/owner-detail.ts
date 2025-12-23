import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OwnerService } from '../../core/services/owner.service';
import { Owner } from '../../core/models/owner.model';

declare const google: any;

@Component({
  standalone: true,
  selector: 'app-owner-detail',
  imports: [CommonModule],
  templateUrl: './owner-detail.html',
  styleUrls: ['./owner-detail.scss'], 
})
export class OwnerDetailComponent implements OnInit, AfterViewInit {

  owner?: Owner;
  map: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ownerService: OwnerService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.owner = this.ownerService.getOwnerById(id);
  }

  ngAfterViewInit() {
    if (this.owner) {
      this.loadMap();
    }
  }

  loadMap() {
    const mapElement = document.getElementById('map');

    this.map = new google.maps.Map(mapElement, {
      center: {
        lat: this.owner!.latitude,
        lng: this.owner!.longitude
      },
      zoom: 14
    });

    new google.maps.Marker({
      position: {
        lat: this.owner!.latitude,
        lng: this.owner!.longitude
      },
      map: this.map,
      title: this.owner!.shopName
    });
  }

  approve() {
    if (!this.owner) return;
    this.ownerService.updateStatus(this.owner.id, 'APPROVED');
    this.router.navigate(['/owners']);
  }

  reject() {
    if (!this.owner) return;
    this.ownerService.updateStatus(this.owner.id, 'REJECTED');
    this.router.navigate(['/owners']);
  }

  back() {
    this.router.navigate(['/owners']);
  }
}
