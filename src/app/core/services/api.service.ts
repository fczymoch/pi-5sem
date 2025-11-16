import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ConnectionStatus {
  isConnected: boolean;
  message: string;
  lastCheck: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl || 'http://localhost:8080/api';
  private connectionStatus$ = new BehaviorSubject<ConnectionStatus>({
    isConnected: false,
    message: 'Verificando conexão...',
    lastCheck: new Date()
  });

  constructor(private http: HttpClient) {
    this.checkConnection();
    // Verifica a conexão a cada 30 segundos
    setInterval(() => this.checkConnection(), 30000);
  }

  get connectionStatus(): Observable<ConnectionStatus> {
    return this.connectionStatus$.asObservable();
  }

  get isConnected(): boolean {
    return this.connectionStatus$.value.isConnected;
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    
    // Add auth token if available in the future
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }

  private checkConnection(): void {
    console.log(`🔗 Verificando conexão com API: ${this.baseUrl}`);
    
    this.http.get(`${this.baseUrl}/dashboard`, { headers: this.getHeaders() })
      .subscribe({
        next: () => {
          console.log('✅ Conectado ao backend Spring Boot');
          this.connectionStatus$.next({
            isConnected: true,
            message: 'Conectado ao backend Spring Boot',
            lastCheck: new Date()
          });
        },
        error: (error) => {
          console.warn('❌ Backend não disponível, usando dados mock:', error.message);
          this.connectionStatus$.next({
            isConnected: false,
            message: `Backend não disponível (${error.status || 'sem conexão'}). Usando dados mock.`,
            lastCheck: new Date()
          });
        }
      });
  }

  get<T>(endpoint: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    return this.http.get<T>(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders(),
      params: httpParams
    }).pipe(
      retry(1),
      catchError(this.handleError<T>())
    );
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data, {
      headers: this.getHeaders()
    }).pipe(
      retry(1),
      catchError(this.handleError<T>())
    );
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, data, {
      headers: this.getHeaders()
    }).pipe(
      retry(1),
      catchError(this.handleError<T>())
    );
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders()
    }).pipe(
      retry(1),
      catchError(this.handleError<T>())
    );
  }

  private handleError<T>() {
    return (error: any): Observable<T> => {
      console.error('❌ Erro na API:', error);
      this.connectionStatus$.next({
        isConnected: false,
        message: `Erro na API: ${error.message || 'Erro desconhecido'}`,
        lastCheck: new Date()
      });
      
      // Return empty result to let service handle fallback
      throw error;
    };
  }
}