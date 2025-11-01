import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DataFormComponent } from '../../../shared/components/data-form/data-form.component';
import { EmployeeService } from '../../../core/services/employee.service';
import { Employee } from '../../../core/models/employee';

type FormField = {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'chips';
  options?: { value: any; label: string }[];
  required?: boolean;
};

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    DataFormComponent
  ],
  template: `
    <div class="form-container">
      <mat-toolbar color="primary">
        <span>{{isEdit ? 'Editar' : 'Novo'}} Funcionário</span>
      </mat-toolbar>

      <app-data-form
        [fields]="formFields"
        [initialValue]="employee"
        [submitLabel]="isEdit ? 'Atualizar' : 'Criar'"
        (onSubmit)="handleSubmit($event)"
        (onCancel)="handleCancel()">
      </app-data-form>
    </div>
  `,
  styles: [`
    .form-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    mat-toolbar {
      width: 100%;
      margin-bottom: 20px;
    }

    app-data-form {
      width: 100%;
      max-width: 800px;
      padding: 0 20px;
    }
  `]
})
export class EmployeeFormComponent implements OnInit {
  employee: Employee = {
    id: 0,
    name: '',
    position: '',
    department: '',
    email: '',
    phone: '',
    hiringDate: new Date(),
    status: 'active',
    certifications: [],
    courses: [],
    lastTrainingDate: new Date()
  };
  isEdit = false;
  formFields: FormField[] = [
    { key: 'name', label: 'Nome', type: 'text', required: true },
    { key: 'position', label: 'Cargo', type: 'text', required: true },
    { key: 'department', label: 'Departamento', type: 'text', required: true },
    { key: 'email', label: 'E-mail', type: 'text', required: true },
    { key: 'phone', label: 'Telefone', type: 'text', required: true },
    { key: 'hiringDate', label: 'Data de Contratação', type: 'date', required: true },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { value: 'active', label: 'Ativo' },
        { value: 'inactive', label: 'Inativo' }
      ]
    },
    { key: 'certifications', label: 'Certificações', type: 'chips', required: false },
    { key: 'courses', label: 'Cursos', type: 'chips', required: false },
    { key: 'lastTrainingDate', label: 'Data do Último Treinamento', type: 'date', required: true }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private employeeService: EmployeeService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.employeeService.getEmployee(Number(id)).subscribe(employee => {
        if (employee) {
          this.employee = employee;
        }
      });
    }
  }

  handleSubmit(formData: any) {
    const employee = { ...formData } as Employee;
    if (this.isEdit && this.employee?.id) {
      employee.id = this.employee.id;
      this.employeeService.updateEmployee(employee).subscribe(() => {
        this.router.navigate(['/employees']);
      });
    } else {
      this.employeeService.createEmployee(employee).subscribe(() => {
        this.router.navigate(['/employees']);
      });
    }
  }

  handleCancel() {
    this.router.navigate(['/employees']);
  }
}