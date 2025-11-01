import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Forklift } from '../models/forklift';

@Injectable({
  providedIn: 'root'
})
export class ForkliftService {
  private mockForklifts: Forklift[] = [
    {
      id: 1,
      model: 'XL-2000',
      serialNumber: 'FL-2023-001',
      manufacturer: 'ForkMaster',
      capacity: 2000,
      lastMaintenanceDate: new Date('2023-09-15'),
      nextMaintenanceDate: new Date('2024-03-15'),
      status: 'available',
      location: 'Warehouse A',
      isInactive: false
    },
    // Add more mock data here
  ];

  getForklifts(): Observable<Forklift[]> {
    return of(this.mockForklifts);
  }

  getForklift(id: number): Observable<Forklift | undefined> {
    return of(this.mockForklifts.find(fork => fork.id === id));
  }

  createForklift(forklift: Forklift): Observable<Forklift> {
    const newForklift = { ...forklift, id: this.mockForklifts.length + 1 };
    this.mockForklifts.push(newForklift);
    return of(newForklift);
  }

  updateForklift(forklift: Forklift): Observable<Forklift> {
    const index = this.mockForklifts.findIndex(fork => fork.id === forklift.id);
    if (index !== -1) {
      this.mockForklifts[index] = forklift;
    }
    return of(forklift);
  }

  deleteForklift(id: number): Observable<boolean> {
    const index = this.mockForklifts.findIndex(fork => fork.id === id);
    if (index !== -1) {
      this.mockForklifts.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}