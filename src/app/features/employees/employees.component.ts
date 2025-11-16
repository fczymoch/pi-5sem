import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DataGridComponent } from '../../shared/components/data-grid/data-grid.component';
import { EmployeeService } from '../../core/services/employee.service';
import { Employee } from '../../core/models/employee';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    DataGridComponent
  ],
  template: `
    <div class="employees-container">
      <mat-toolbar color="primary">
        <span>Gestão de Funcionários</span>
        <span class="spacer"></span>
        <button mat-raised-button color="accent" (click)="addEmployee()">
          <mat-icon>person_add</mat-icon>
          Novo Funcionário
        </button>
      </mat-toolbar>

      <div class="filter-section">
        <mat-form-field appearance="outline">
          <mat-label>Pesquisar</mat-label>
          <input matInput [formControl]="searchControl" placeholder="Nome, Cargo...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Departamento</mat-label>
          <mat-select [formControl]="departmentFilter">
            <mat-option value="">Todos</mat-option>
            <mat-option *ngFor="let dept of departments" [value]="dept">
              {{dept}}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select [formControl]="statusFilter">
            <mat-option value="">Todos</mat-option>
            <mat-option value="active">Ativo</mat-option>
            <mat-option value="inactive">Inativo</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <!-- Loading state -->
      <div *ngIf="isLoading" class="loading-message">
        <mat-icon>refresh</mat-icon>
        <p>Carregando funcionários...</p>
      </div>

      <!-- Data grid quando há dados -->
      <app-data-grid
        *ngIf="!isLoading && employees.length > 0"
        [data]="filteredEmployees"
        [columns]="columns"
        (onView)="viewEmployee($event)"
        (onEdit)="editEmployee($event)"
        (onDelete)="deleteEmployee($event)">
      </app-data-grid>

      <!-- Mensagem quando não há dados (após carregamento) -->
      <div *ngIf="!isLoading && employees.length === 0" class="no-data-message">
        <mat-icon>cloud_off</mat-icon>
        <h3>Nenhum funcionário encontrado</h3>
        <p>Os dados não estão disponíveis. Verifique se o backend está rodando ou se há funcionários cadastrados.</p>
      </div>
    </div>
  `,
  styles: [`
    .employees-container {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    mat-toolbar {
      margin-bottom: 20px;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .filter-section {
      display: flex;
      gap: 16px;
      padding: 16px;
      flex-wrap: wrap;
    }

    .filter-section mat-form-field {
      flex: 1;
      min-width: 200px;
    }

    .no-data-message, .loading-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
      color: #666;
    }

    .no-data-message mat-icon, .loading-message mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .loading-message mat-icon {
      animation: spin 2s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 600px) {
      .filter-section {
        flex-direction: column;
      }

      .filter-section mat-form-field {
        width: 100%;
      }
    }
  `]
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  departments: string[] = [];
  isLoading: boolean = false;
  
  // Form controls para filtros
  searchControl = new FormControl('');
  departmentFilter = new FormControl('');
  statusFilter = new FormControl('');
  
  columns: { key: string; label: string; type?: 'date' | 'status' | 'text' }[] = [
    { key: 'name', label: 'Nome', type: 'text' },
    { key: 'position', label: 'Cargo', type: 'text' },
    { key: 'department', label: 'Departamento', type: 'text' },
    { key: 'hiringDate', label: 'Data de Contratação', type: 'date' },
    { key: 'status', label: 'Status', type: 'status' }
  ];

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadEmployees();
    this.setupFilters();
  }

  loadEmployees() {
    console.log('🔄 Componente: Iniciando carregamento de funcionários');
    this.isLoading = true;
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        console.log('📋 Componente: Funcionários recebidos do service:', employees.length, 'itens', employees);
        this.employees = employees;
        this.filteredEmployees = employees;
        this.departments = [...new Set(employees.map(e => e.department))];
        this.applyFilters();
        this.isLoading = false;
        console.log('✅ Componente: Carregamento concluído. Exibindo:', this.filteredEmployees.length, 'funcionários');
      },
      error: (error) => {
        console.error('❌ Componente: Erro ao carregar funcionários:', error);
        this.employees = [];
        this.filteredEmployees = [];
        this.departments = [];
        this.isLoading = false;
      }
    });
  }

  setupFilters() {
    // Configurar listeners para os controles de filtro
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => this.applyFilters());

    this.departmentFilter.valueChanges.subscribe(() => this.applyFilters());
    this.statusFilter.valueChanges.subscribe(() => this.applyFilters());
  }

  applyFilters() {
    let filtered = [...this.employees];

    // Aplicar filtro de pesquisa
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    if (searchTerm) {
      filtered = filtered.filter(e =>
        e.name.toLowerCase().includes(searchTerm) ||
        e.position.toLowerCase().includes(searchTerm)
      );
    }

    // Aplicar filtro de departamento
    const department = this.departmentFilter.value;
    if (department) {
      filtered = filtered.filter(e => e.department === department);
    }

    // Aplicar filtro de status
    const status = this.statusFilter.value;
    if (status) {
      filtered = filtered.filter(e => e.status === status);
    }

    this.filteredEmployees = filtered;
  }

  addEmployee() {
    this.router.navigate(['/employees/new']);
  }

  viewEmployee(employee: Employee) {
    this.router.navigate(['/employees', employee.id]);
  }

  editEmployee(employee: Employee) {
    this.router.navigate(['/employees', employee.id, 'edit']);
  }

  deleteEmployee(employee: Employee) {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
      this.employeeService.deleteEmployee(employee.id).subscribe(() => {
        this.loadEmployees();
      });
    }
  }
}