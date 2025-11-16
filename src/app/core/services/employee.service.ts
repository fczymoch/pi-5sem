import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Employee } from '../models/employee';
import { ApiService } from './api.service';
import { ApiEmployeeResponse, ApiEmployeeRequest, ApiPageableResponse } from '../models/api.interfaces';
import { ApiMapper } from '../models/api.mapper';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private apiService: ApiService) {}
  private mockEmployees: Employee[] = [
    {
      id: 1,
      name: 'John Doe',
      position: 'Forklift Operator',
      department: 'Logistics',
      email: 'john.doe@company.com',
      phone: '(11) 99999-9999',
      hiringDate: new Date('2022-01-15'),
      status: 'active',
      courses: ['Forklift Operation', 'Safety Training'],
      lastTrainingDate: new Date('2023-06-20')
    },
    {
      id: 2,
      name: 'Maria Silva',
      position: 'Warehouse Supervisor',
      department: 'Logistics',
      email: 'maria.silva@company.com',
      phone: '(11) 98888-8888',
      hiringDate: new Date('2021-03-10'),
      status: 'active',
      courses: ['Leadership', 'Safety Management', 'Quality Control'],
      lastTrainingDate: new Date('2023-08-15')
    }
  ];

  getEmployees(): Observable<Employee[]> {
    console.log('👥 Buscando funcionários da API...');
    
    return this.apiService.get<ApiPageableResponse<ApiEmployeeResponse>>('/employees').pipe(
      map(apiResponse => {
        console.log('🔍 RESPOSTA BRUTA DA API FUNCIONÁRIOS:', apiResponse);
        
        // Verifica se a resposta tem a estrutura esperada do Spring Boot
        if (apiResponse && apiResponse.content && Array.isArray(apiResponse.content)) {
          console.log('✅ Funcionários recebidos da API:', apiResponse.content.length, 'itens (página', apiResponse.number + 1, 'de', apiResponse.totalPages, ')');
          return apiResponse.content.map(employee => ApiMapper.mapEmployeeFromApi(employee));
        } else {
          console.error('❌ API retornou estrutura inesperada:', typeof apiResponse, apiResponse);
          return [];
        }
      }),
      catchError((error) => {
        console.error('❌ Erro ao buscar funcionários da API:', error.message);
        console.log('📋 Retornando lista vazia - aguardando backend estar disponível');
        return of([]);
      })
    );
  }

  getEmployee(id: number): Observable<Employee | undefined> {
    console.log(`👤 Buscando funcionário ID: ${id} na API...`);
    
    return this.apiService.get<ApiEmployeeResponse>(`/employees/${id}`).pipe(
      map(apiResponse => {
        console.log('✅ Funcionário encontrado na API:', apiResponse);
        return ApiMapper.mapEmployeeFromApi(apiResponse);
      }),
      catchError((error) => {
        console.error(`❌ Funcionário ID ${id} não encontrado na API:`, error.message);
        return of(undefined);
      })
    );
  }

  createEmployee(employee: Omit<Employee, 'id'>): Observable<Employee> {
    console.log('➕ Criando novo funcionário...');
    const apiRequest = ApiMapper.mapEmployeeToApi(employee);
    
    return this.apiService.post<ApiEmployeeResponse>('/employees', apiRequest).pipe(
      map(apiResponse => {
        console.log('✅ Funcionário criado na API:', apiResponse);
        return ApiMapper.mapEmployeeFromApi(apiResponse);
      }),
      catchError((error) => {
        console.error('❌ Falha ao criar funcionário na API:', error.message);
        throw error; // Propaga o erro para o componente tratar
      })
    );
  }

  updateEmployee(employee: Employee): Observable<Employee> {
    console.log('✏️ Atualizando funcionário na API:', employee.name);
    const apiRequest = ApiMapper.mapEmployeeToApi(employee);
    
    return this.apiService.put<ApiEmployeeResponse>(`/employees/${employee.id}`, apiRequest).pipe(
      map(apiResponse => {
        console.log('✅ Funcionário atualizado na API:', apiResponse);
        return ApiMapper.mapEmployeeFromApi(apiResponse);
      }),
      catchError((error) => {
        console.error('❌ Falha ao atualizar funcionário na API:', error.message);
        throw error; // Propaga o erro para o componente tratar
      })
    );
  }

  deleteEmployee(id: number): Observable<boolean> {
    console.log(`🗑️ Removendo funcionário ID: ${id} da API...`);
    
    return this.apiService.delete(`/employees/${id}`).pipe(
      map(() => {
        console.log('✅ Funcionário removido da API com sucesso');
        return true;
      }),
      catchError((error) => {
        console.error('❌ Falha ao remover funcionário da API:', error.message);
        throw error; // Propaga o erro para o componente tratar
      })
    );
  }
}