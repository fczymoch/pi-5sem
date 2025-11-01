import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ForkliftUsage } from '../models/forklift-usage';

@Injectable({
  providedIn: 'root'
})
export class ForkliftUsageService {
  private mockUsageHistory: ForkliftUsage[] = [
    {
      id: 1,
      employeeId: 1,
      forkliftId: 1,
      startTime: new Date('2023-10-31T08:00:00'),
      endTime: new Date('2023-10-31T16:00:00'),
      employee: {
        id: 1,
        name: 'João Silva',
        position: 'Operador'
      },
      forklift: {
        id: 1,
        model: 'XL-2000',
        serialNumber: 'FL-2023-001'
      }
    }
  ];

  constructor() {}

  getUsageHistory(): Observable<ForkliftUsage[]> {
    return of(this.mockUsageHistory);
  }

  getForkliftHistory(forkliftId: number): Observable<ForkliftUsage[]> {
    return of(this.mockUsageHistory.filter(usage => usage.forkliftId === forkliftId));
  }

  getEmployeeHistory(employeeId: number): Observable<ForkliftUsage[]> {
    return of(this.mockUsageHistory.filter(usage => usage.employeeId === employeeId));
  }

  getCurrentUsage(forkliftId: number): Observable<ForkliftUsage | undefined> {
    return of(this.mockUsageHistory.find(usage => 
      usage.forkliftId === forkliftId && !usage.endTime
    ));
  }

  startUsage(employeeId: number, forkliftId: number): Observable<ForkliftUsage> {
    const newUsage: ForkliftUsage = {
      id: this.mockUsageHistory.length + 1,
      employeeId,
      forkliftId,
      startTime: new Date(),
    };
    this.mockUsageHistory.push(newUsage);
    return of(newUsage);
  }

  endUsage(usageId: number): Observable<ForkliftUsage> {
    const usage = this.mockUsageHistory.find(u => u.id === usageId);
    if (usage) {
      usage.endTime = new Date();
    }
    return of(usage!);
  }
}