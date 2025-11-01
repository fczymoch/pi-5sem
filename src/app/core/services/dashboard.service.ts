import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';

export interface DashboardData {
  forkliftStatus: {
    available: number;
    inUse: number;
    maintenance: number;
  };
  employeeCertifications: {
    valid: number;
    expiring: number;
    expired: number;
  };
  stats: {
    totalForklifts: number;
    totalEmployees: number;
    maintenanceCount: number;
    availableCount: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private mockData$ = new BehaviorSubject<DashboardData>({
    forkliftStatus: {
      available: 8,
      inUse: 5,
      maintenance: 2
    },
    employeeCertifications: {
      valid: 15,
      expiring: 3,
      expired: 2
    },
    stats: {
      totalForklifts: 15,
      totalEmployees: 20,
      maintenanceCount: 2,
      availableCount: 8
    }
  });

  constructor() {
    // Atualiza os dados a cada minuto
    interval(60000).subscribe(() => {
      this.updateMockData();
    });
  }

  getDashboardData(): Observable<DashboardData> {
    return this.mockData$.asObservable();
  }

  private updateMockData() {
    const currentData = this.mockData$.getValue();
    
    // Simula mudanças aleatórias nos dados
    const newData: DashboardData = {
      forkliftStatus: {
        available: this.adjustNumber(currentData.forkliftStatus.available, 1),
        inUse: this.adjustNumber(currentData.forkliftStatus.inUse, 1),
        maintenance: this.adjustNumber(currentData.forkliftStatus.maintenance, 1, true)
      },
      employeeCertifications: {
        valid: this.adjustNumber(currentData.employeeCertifications.valid, 2),
        expiring: this.adjustNumber(currentData.employeeCertifications.expiring, 1),
        expired: this.adjustNumber(currentData.employeeCertifications.expired, 1, true)
      },
      stats: {
        totalForklifts: currentData.stats.totalForklifts,
        totalEmployees: currentData.stats.totalEmployees,
        maintenanceCount: 0,
        availableCount: 0
      }
    };

    // Atualiza os stats baseado nos novos valores
    newData.stats.maintenanceCount = newData.forkliftStatus.maintenance;
    newData.stats.availableCount = newData.forkliftStatus.available;

    this.mockData$.next(newData);
  }

  private adjustNumber(current: number, maxChange: number, preferDecrease = false): number {
    const change = Math.floor(Math.random() * (maxChange + 1));
    const increase = preferDecrease ? Math.random() > 0.7 : Math.random() > 0.3;
    
    let newValue = increase ? current + change : current - change;
    
    // Mantém os valores dentro de limites razoáveis
    newValue = Math.max(0, Math.min(20, newValue));
    
    return newValue;
  }
}