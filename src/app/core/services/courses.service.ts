import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private availableCourses = [
    'Segurança no Trabalho',
    'Operação de Empilhadeiras',
    'Manuseio de Cargas',
    'Primeiros Socorros',
    'Prevenção de Acidentes',
    'Gestão de Qualidade',
    'Logística e Armazenagem',
    'Liderança e Gestão de Equipes',
    'Comunicação Eficaz',
    'Excel Avançado',
    'Sistema de Gestão ERP',
    'Controle de Inventário',
    'Normas Regulamentadoras NR-11',
    'Normas Regulamentadoras NR-12',
    'Meio Ambiente e Sustentabilidade'
  ];

  getAvailableCourses(): Observable<string[]> {
    // Simula uma requisição ao backend
    return of(this.availableCourses);
  }
}