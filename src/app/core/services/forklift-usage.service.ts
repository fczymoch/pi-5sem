import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { ForkliftUsage } from '../models/forklift-usage';
import { ApiForkliftUsageHistoryResponse } from '../models/api.interfaces';
import { ApiMapper } from '../models/api.mapper';

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

  constructor(private apiService: ApiService) {}

  getUsageHistory(): Observable<ForkliftUsage[]> {
    return of(this.mockUsageHistory);
  }

  getForkliftHistory(forkliftId: number): Observable<ForkliftUsage[]> {
    console.log('📋 Buscando histórico de uso da empilhadeira:', forkliftId);
    
    return this.apiService.get<ApiForkliftUsageHistoryResponse[]>(`/forklifts/${forkliftId}/usage-history`).pipe(
      map(apiResponse => {
        console.log('✅ Histórico de uso recebido da API:', apiResponse.length, 'itens');
        return apiResponse.map(usage => {
          const mapped = ApiMapper.mapForkliftUsageHistoryFromApi(usage);
          // Define o forkliftId no objeto mapeado
          mapped.forkliftId = forkliftId;
          return mapped;
        });
      }),
      catchError((error) => {
        console.error('❌ Erro ao buscar histórico de uso da API:', error.message);
        console.log('📋 Retornando histórico mock - aguardando backend estar disponível');
        return of(this.mockUsageHistory.filter(usage => usage.forkliftId === forkliftId));
      })
    );
  }

  getEmployeeHistory(employeeId: number): Observable<ForkliftUsage[]> {
    return of(this.mockUsageHistory.filter(usage => usage.employeeId === employeeId));
  }

  getCurrentUsage(forkliftId: number): Observable<ForkliftUsage | undefined> {
    console.log('🔄 Buscando uso atual da empilhadeira:', forkliftId);
    
    return this.apiService.get<ApiForkliftUsageHistoryResponse[]>('/forklift-usages/active').pipe(
      map(apiResponse => {
        console.log('✅ Usos ativos recebidos da API:', apiResponse.length, 'itens');
        const currentUsage = apiResponse.find(usage => 
          // Assumindo que o backend retorna o ID da empilhadeira em um campo específico
          // Ajustar conforme a resposta real da API
          usage.status === 1 // 1 = ACTIVE
        );
        
        if (currentUsage) {
          const mapped = ApiMapper.mapForkliftUsageHistoryFromApi(currentUsage);
          mapped.forkliftId = forkliftId;
          return mapped;
        }
        return undefined;
      }),
      catchError((error) => {
        console.error('❌ Erro ao buscar uso atual da API:', error.message);
        console.log('📋 Retornando uso mock - aguardando backend estar disponível');
        return of(this.mockUsageHistory.find(usage => 
          usage.forkliftId === forkliftId && !usage.endTime
        ));
      })
    );
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