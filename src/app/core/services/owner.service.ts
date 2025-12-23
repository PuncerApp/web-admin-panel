import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Owner } from '../models/owner.model';

@Injectable({ providedIn: 'root' })
export class OwnerService {

  private owners$ = new BehaviorSubject<Owner[]>([
    {
      id: 1,
      name: 'Ravi',
      shopName: 'Ravi Tyres',
      mobile: '9876543210',
      location: 'Salem',
      latitude: 13.0827,
      longitude: 80.2707,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    }
  ]);

  getOwners() {
    return this.owners$.asObservable();
  }

  getOwnerById(id: number): Owner | undefined {
    return this.owners$.value.find(o => o.id === id);
  }

  updateStatus(id: number, status: Owner['status']) {
    const updated = this.owners$.value.map(o =>
      o.id === id ? { ...o, status } : o
    );
    this.owners$.next(updated);
  }
}
