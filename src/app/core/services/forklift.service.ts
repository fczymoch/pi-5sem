import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Forklift } from '../models/forklift';
import { ApiService } from './api.service';
import { ApiForkliftResponse, ApiForkliftRequest, ApiPageableResponse } from '../models/api.interfaces';
import { ApiMapper } from '../models/api.mapper';

@Injectable({
  providedIn: 'root'
})
export class ForkliftService {
  constructor(private apiService: ApiService) {}

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
      location: 'Warehouse A'
    },
    {
      id: 2,
      model: 'HY-3000',
      serialNumber: 'FL-2023-002',
      manufacturer: 'Hyster',
      capacity: 3000,
      lastMaintenanceDate: new Date('2023-10-01'),
      nextMaintenanceDate: new Date('2024-04-01'),
      status: 'inUse',
      location: 'Warehouse B'
    },
    {
      id: 3,
      model: 'TY-1500',
      serialNumber: 'FL-2023-003',
      manufacturer: 'Toyota',
      capacity: 1500,
      lastMaintenanceDate: new Date('2023-08-20'),
      nextMaintenanceDate: new Date('2024-02-20'),
      status: 'maintenance',
      location: 'Maintenance Bay'
    }
  ];

  getAllForklifts(): Observable<Forklift[]> {
    console.log('🚚 Buscando empilhadeiras da API...');
    
    return this.apiService.get<ApiPageableResponse<ApiForkliftResponse>>('/forklifts').pipe(
      map(apiResponse => {
        console.log('🔍 RESPOSTA BRUTA DA API EMPILHADEIRAS:', apiResponse);
        
        // Verifica se a resposta tem a estrutura esperada do Spring Boot
        if (apiResponse && apiResponse.content && Array.isArray(apiResponse.content)) {
          console.log('✅ Empilhadeiras recebidas da API:', apiResponse.content.length, 'itens (página', apiResponse.number + 1, 'de', apiResponse.totalPages, ')');
          return apiResponse.content.map(forklift => ApiMapper.mapForkliftFromApi(forklift));
        } else {
          console.error('❌ API retornou estrutura inesperada:', typeof apiResponse, apiResponse);
          return [];
        }
      }),
      catchError((error) => {
        console.error('❌ Erro ao buscar empilhadeiras da API:', error.message);
        console.log('📋 Retornando lista vazia - aguardando backend estar disponível');
        return of([]);
      })
    );
  }

  getForkliftById(id: number): Observable<Forklift | undefined> {
    console.log(`🚚 Buscando empilhadeira ID: ${id} na API...`);
    
    return this.apiService.get<ApiForkliftResponse>(`/forklifts/${id}`).pipe(
      map(apiResponse => {
        console.log('✅ Empilhadeira encontrada na API:', apiResponse);
        return ApiMapper.mapForkliftFromApi(apiResponse);
      }),
      catchError((error) => {
        console.error(`❌ Empilhadeira ID ${id} não encontrada na API:`, error.message);
        return of(undefined);
      })
    );
  }

  createForklift(forklift: Omit<Forklift, 'id'>): Observable<Forklift> {
    console.log('➕ Criando nova empilhadeira...');
    const apiRequest = ApiMapper.mapForkliftToApi(forklift);
    
    return this.apiService.post<ApiForkliftResponse>('/forklifts', apiRequest).pipe(
      map(apiResponse => {
        console.log('✅ Empilhadeira criada na API:', apiResponse);
        return ApiMapper.mapForkliftFromApi(apiResponse);
      }),
      catchError((error) => {
        console.error('❌ Falha ao criar empilhadeira na API:', error.message);
        throw error; // Propaga o erro para o componente tratar
      })
    );
  }

  updateForklift(forklift: Forklift): Observable<Forklift> {
    console.log('✏️ Atualizando empilhadeira na API:', forklift.model);
    const apiRequest = ApiMapper.mapForkliftToApi(forklift);
    
    return this.apiService.put<ApiForkliftResponse>(`/forklifts/${forklift.id}`, apiRequest).pipe(
      map(apiResponse => {
        console.log('✅ Empilhadeira atualizada na API:', apiResponse);
        return ApiMapper.mapForkliftFromApi(apiResponse);
      }),
      catchError((error) => {
        console.error('❌ Falha ao atualizar empilhadeira na API:', error.message);
        throw error; // Propaga o erro para o componente tratar
      })
    );
  }

  deleteForklift(id: number): Observable<boolean> {
    console.log(`🗑️ Removendo empilhadeira ID: ${id} da API...`);
    
    return this.apiService.delete(`/forklifts/${id}`).pipe(
      map(() => {
        console.log('✅ Empilhadeira removida da API com sucesso');
        return true;
      }),
      catchError((error) => {
        console.error('❌ Falha ao remover empilhadeira da API:', error.message);
        throw error; // Propaga o erro para o componente tratar
      })
    );
  }
}