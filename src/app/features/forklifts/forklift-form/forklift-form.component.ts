import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DataFormComponent } from '../../../shared/components/data-form/data-form.component';
import { ForkliftService } from '../../../core/services/forklift.service';
import { Forklift } from '../../../core/models/forklift';

type FormField = {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'chips';
  options?: { value: any; label: string }[];
  required?: boolean;
};

@Component({
  selector: 'app-forklift-form',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    DataFormComponent
  ],
  template: `
    <div class="page-container">
      <mat-toolbar color="primary">
        <span>{{isEdit ? 'Editar' : 'Nova'}} Empilhadeira</span>
      </mat-toolbar>

      <div class="content-container">
        <div class="form-header">
          <h2>Informações da Empilhadeira</h2>
          <p>Preencha os dados do equipamento</p>
        </div>

        <div class="form-container">
          <app-data-form
            [fields]="formFields"
            [initialValue]="forklift"
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
      margin-bottom: 32px;
    }

    .content-container {
      flex: 1;
      padding: 0 32px;
      margin: 0 auto;
      width: 100%;
      max-width: 1400px;
    }

    .form-header {
      margin-bottom: 24px;
      padding: 0 16px;
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
    }

    .form-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 24px;
    }

    app-data-form {
      display: block;
      width: 100%;
    }

    app-data-form ::ng-deep {
      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 24px;
        align-items: start;
      }

      .form-field {
        margin-bottom: 0;
      }

      .form-actions {
        grid-column: 1 / -1;
        display: flex;
        justify-content: flex-end;
        gap: 16px;
        margin-top: 32px;
        padding-top: 24px;
        border-top: 1px solid rgba(0, 0, 0, 0.12);
      }
    }

    @media (min-width: 768px) {
      .content-container {
        padding: 0 48px;
      }

      app-data-form ::ng-deep .form-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1200px) {
      app-data-form ::ng-deep .form-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
  `]
})
export class ForkliftFormComponent implements OnInit {
  forklift: Forklift = {
    id: 0,
    model: '',
    serialNumber: '',
    manufacturer: '',
    capacity: 0,
    lastMaintenanceDate: new Date(),
    nextMaintenanceDate: new Date(),
    status: 'available',
    location: ''
  };
  isEdit = false;
  formFields: FormField[] = [
    { key: 'model', label: 'Modelo', type: 'text', required: true },
    { key: 'serialNumber', label: 'Número de Série', type: 'text', required: true },
    { key: 'manufacturer', label: 'Fabricante', type: 'text', required: true },
    { key: 'capacity', label: 'Capacidade (kg)', type: 'number', required: true },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { value: 'available', label: 'Disponível' },
        { value: 'inUse', label: 'Em Uso' },
        { value: 'maintenance', label: 'Em Manutenção' }
      ]
    },
    { key: 'location', label: 'Localização', type: 'text', required: true },
    { key: 'lastMaintenanceDate', label: 'Última Manutenção', type: 'date', required: true },
    { key: 'nextMaintenanceDate', label: 'Próxima Manutenção', type: 'date', required: true }
  ] as const;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private forkliftService: ForkliftService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.forkliftService.getForkliftById(Number(id)).subscribe((forklift: Forklift | undefined) => {
        if (forklift) {
          this.forklift = forklift;
        }
      });
    }
  }

  handleSubmit(formData: any) {
    const forklift = { ...formData } as Forklift;
    if (this.isEdit && this.forklift?.id) {
      forklift.id = this.forklift.id;
      this.forkliftService.updateForklift(forklift).subscribe(() => {
        this.router.navigate(['/forklifts']);
      });
    } else {
      this.forkliftService.createForklift(forklift).subscribe(() => {
        this.router.navigate(['/forklifts']);
      });
    }
  }

  handleCancel() {
    this.router.navigate(['/forklifts']);
  }
}