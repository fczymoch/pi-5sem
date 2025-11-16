import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { ApiService } from './api.service';
import { ApiDashboardResponse, ApiActivityLogResponse } from '../models/api.interfaces';
import { ApiMapper } from '../models/api.mapper';
import { ActivityLog } from '../models/activity-log';

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
  constructor(private apiService: ApiService) {
    // Construtor limpo - apenas injeta o serviço de API
  }

  getDashboardData(): Observable<DashboardData> {
    console.log('📊 Buscando dados do dashboard...');
    
    return this.apiService.get<ApiDashboardResponse>('/dashboard').pipe(
      map(apiResponse => {
        console.log('✅ Dados recebidos da API:', apiResponse);
        return ApiMapper.mapDashboardFromApi(apiResponse);
      }),
      catchError((error) => {
        console.error('❌ Dashboard não disponível da API:', error.message);
        // Retorna dados zerados quando API não está disponível
        return of({
          forkliftStatus: {
            available: 0,
            inUse: 0,
            maintenance: 0
          },
          employeeCertifications: {
            valid: 0,
            expiring: 0,
            expired: 0
          },
          stats: {
            totalForklifts: 0,
            totalEmployees: 0,
            maintenanceCount: 0,
            availableCount: 0
          }
        });
      })
    );
  }

  getConnectionStatus(): Observable<any> {
    return this.apiService.connectionStatus;
  }

  getRecentActivities(limit: number = 10): Observable<ActivityLog[]> {
    console.log('📋 Buscando atividades recentes da API...');
    
    return this.apiService.get<ApiActivityLogResponse[]>(`/dashboard/recent-activities?limit=${limit}`).pipe(
      map(apiResponse => {
        console.log('✅ Atividades recebidas da API:', apiResponse.length, 'itens');
        return apiResponse.map(activity => ApiMapper.mapActivityLogFromApi(activity));
      }),
      catchError((error) => {
        console.error('❌ Erro ao buscar atividades da API:', error.message);
        console.log('📋 Retornando atividades mock - aguardando backend estar disponível');
        // Retorna atividades mock quando API não está disponível
        return of([
          {
            id: 1,
            operationType: 'MAINTENANCE',
            entity: 'Empilhadeira',
            description: 'Empilhadeira XL-2000 entrou em manutenção',
            timestamp: new Date(2025, 10, 16, 14, 30),
            details: 'Manutenção preventiva programada',
            icon: 'build',
            color: 'warn'
          },
          {
            id: 2,
            operationType: 'CREATE',
            entity: 'Funcionário',
            description: 'Novo operador certificado: João Silva',
            timestamp: new Date(2025, 10, 16, 13, 15),
            details: 'Certificação para empilhadeiras elétricas',
            icon: 'add_circle',
            color: 'primary'
          },
          {
            id: 3,
            operationType: 'COMPLETE',
            entity: 'Empilhadeira',
            description: 'Manutenção concluída: Empilhadeira FL-100',
            timestamp: new Date(2025, 10, 16, 11, 45),
            details: 'Troca de óleo e filtros',
            icon: 'check_circle',
            color: 'primary'
          }
        ]);
      })
    );
  }
}
