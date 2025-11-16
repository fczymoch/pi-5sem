import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DataFormComponent } from '../../../shared/components/data-form/data-form.component';
import { EmployeeService } from '../../../core/services/employee.service';
import { CoursesService } from '../../../core/services/courses.service';
import { Employee } from '../../../core/models/employee';

type FormField = {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'chips' | 'select-chips';
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
    <div class="page-container">
      <mat-toolbar color="primary">
        <span>{{isEdit ? 'Editar' : 'Novo'}} Funcionário</span>
      </mat-toolbar>

      <div class="content-container">
        <div class="form-header">
          <h2>Informações do Funcionário</h2>
          <p>Preencha os dados pessoais e profissionais</p>
        </div>

        <div class="form-container">
          <app-data-form
            [fields]="formFields"
            [initialValue]="employee"
            [submitLabel]="isEdit ? 'Atualizar' : 'Criar'"
            (onSubmit)="handleSubmit($event)"
            (onCancel)="handleCancel()">
          </app-data-form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      min-height: 100%;
      display: flex;
      flex-direction: column;
      background-color: #f5f5f5;
    }

    mat-toolbar {
      margin-bottom: 24px;
    }

    .content-container {
      flex: 1;
      padding: 16px;
      margin: 0 auto;
      width: 100%;
      max-width: 1200px;
    }

    .form-header {
      margin-bottom: 24px;
      padding: 0 8px;
    }

    .form-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.87);
    }

    .form-header p {
      margin: 8px 0 0;
      color: rgba(0, 0, 0, 0.6);
      font-size: 0.95rem;
    }

    .form-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 16px;
      overflow: hidden;
    }

    @media (min-width: 600px) {
      .content-container {
        padding: 24px;
      }

      .form-container {
        padding: 24px;
      }

      .form-header {
        padding: 0;
      }
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
    { key: 'courses', label: 'Cursos', type: 'select-chips', required: false, options: [] },
    { key: 'lastTrainingDate', label: 'Data do Último Treinamento', type: 'date', required: true }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private coursesService: CoursesService
  ) {}

  ngOnInit() {
    this.checkEditMode();
    this.loadCourses();
  }

  private checkEditMode() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.employeeService.getEmployee(+id).subscribe(employee => {
        if (employee) {
          this.employee = employee;
        }
      });
    }
  }

  private loadCourses() {
    this.coursesService.getAvailableCourses().subscribe(courses => {
      const courseField = this.formFields.find(field => field.key === 'courses');
      if (courseField) {
        courseField.options = courses.map(course => ({ value: course, label: course }));
      }
    });
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