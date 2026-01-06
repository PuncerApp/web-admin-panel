import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Owner } from '../models/owner.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class OwnerService {

private baseUrl = `${environment.apiBaseUrl}/api/owners`;
  private dataUpdated$ = new Subject<void>();

  constructor(private http: HttpClient) {}

  /** Observable to notify when owner data is updated */
  get onDataUpdated(): Observable<void> {
    return this.dataUpdated$.asObservable();
  }

  /** Notify subscribers that data has been updated */
  notifyDataUpdated(): void {
    this.dataUpdated$.next();
  }

   /** ADMIN PANEL – GET ALL OWNERS */
   getOwners() {
    return this.http.get<Owner[]>(this.baseUrl, {
      observe: 'body',
      responseType: 'json'
    });
  }

  /** ADMIN PANEL – UPDATE STATUS */
  updateStatus(id: number, status: Owner['status']): Observable<Owner> {
    return this.http.put<Owner>(
      `${this.baseUrl}/${id}/status/${status}`,
      {}
    );
  }

  /** WEB OWNER APP – GET BY MOBILE */
  getByMobile(mobile: string): Observable<Owner | null> {
    return this.http.get<Owner | null>(
      `${this.baseUrl}/by-mobile/${mobile}`
    );
  }

  /** WEB OWNER APP – REGISTER */
  registerOwner(payload: Partial<Owner>): Observable<Owner> {
    return this.http.post<Owner>(
      `${this.baseUrl}/register`,
      payload
    );
  }

  /** ADMIN – GET OWNER BY ID */
  getOwnerById(id: number) {
    return this.http.get<Owner>(`${this.baseUrl}/${id}`);
  }

  deleteOwner(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getMyProfile(): Observable<{ status: 'PENDING' | 'APPROVED' | 'REJECTED' }> {
    return this.http.get<{ status: 'PENDING' | 'APPROVED' | 'REJECTED' }>(
      `${this.baseUrl}/me`
    );
  }
}
