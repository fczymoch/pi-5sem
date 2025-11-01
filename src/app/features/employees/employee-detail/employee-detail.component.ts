import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DetailViewComponent } from '../../../shared/components/detail-view/detail-view.component';
import { EmployeeService } from '../../../core/services/employee.service';
import { Employee } from '../../../core/models/employee';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    DetailViewComponent
  ],
  template: `
    <div class="detail-container">
      <mat-toolbar color="primary">
        <span>Detalhes do Funcionário</span>
      </mat-toolbar>

      <app-detail-view
        *ngIf="employee"
        [data]="employee"
        [fields]="fields"
        icon="person"
        (onEdit)="editEmployee($event)"
        (onDelete)="deleteEmployee($event)"
        (onBack)="goBack()">
      </app-detail-view>
    </div>
  `,
  styles: [`
    .detail-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    mat-toolbar {
      width: 100%;
      margin-bottom: 20px;
    }
  `]
})
export class EmployeeDetailComponent implements OnInit {
  employee?: Employee;
  fields: { key: string; label: string; type?: 'text' | 'date' | 'status' | 'array' }[] = [
    { key: 'name', label: 'Nome', type: 'text' },
    { key: 'position', label: 'Cargo', type: 'text' },
    { key: 'department', label: 'Departamento', type: 'text' },
    { key: 'email', label: 'E-mail', type: 'text' },
    { key: 'phone', label: 'Telefone', type: 'text' },
    { key: 'hiringDate', label: 'Data de Contratação', type: 'date' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'certifications', label: 'Certificações', type: 'array' },
    { key: 'courses', label: 'Cursos', type: 'array' },
    { key: 'lastTrainingDate', label: 'Último Treinamento', type: 'date' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadEmployee(id);
  }

  loadEmployee(id: number) {
    this.employeeService.getEmployee(id).subscribe(employee => {
      this.employee = employee;
    });
  }

  editEmployee(employee: Employee) {
    // Implement edit logic
    console.log('Edit employee:', employee);
  }

  deleteEmployee(employee: Employee) {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
      this.employeeService.deleteEmployee(employee.id).subscribe(() => {
        this.goBack();
      });
    }
  }

  goBack() {
    this.router.navigate(['/employees']);
  }
}