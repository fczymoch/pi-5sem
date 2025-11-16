import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-data-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit.emit(form.value)" class="form-wrapper">
      <div class="form-container">
        <ng-container *ngFor="let field of fields">
          <mat-form-field *ngIf="field.type !== 'chips'" class="form-field">
            <mat-label>{{ field.label }}</mat-label>

            <ng-container [ngSwitch]="field.type">
              <input *ngSwitchCase="'text'" matInput [formControlName]="field.key">
              <input *ngSwitchCase="'number'" matInput type="number" [formControlName]="field.key">
              <input *ngSwitchCase="'date'" matInput [matDatepicker]="picker" [formControlName]="field.key">
              <mat-datepicker-toggle *ngSwitchCase="'date'" matIconSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              
              <mat-select *ngSwitchCase="'select'" [formControlName]="field.key">
                <mat-option *ngFor="let option of field.options" [value]="option.value">
                  {{ option.label }}
                </mat-option>
              </mat-select>

              <textarea *ngSwitchCase="'textarea'" matInput [formControlName]="field.key"></textarea>
            </ng-container>

            <mat-error *ngIf="form.get(field.key)?.errors?.['required']">
              {{ field.label }} é obrigatório
            </mat-error>
          </mat-form-field>

          <mat-form-field *ngIf="field.type === 'chips'" class="form-field">
            <mat-label>{{ field.label }}</mat-label>
            <mat-chip-grid #chipGrid>
              <mat-chip-row *ngFor="let item of form.get(field.key)?.value"
                           (removed)="removeChip(field.key, item)">
                {{item}}
                <button matChipRemove>
                  <mat-icon>cancel</mat-icon>
                </button>
              </mat-chip-row>
              <input placeholder="Novo item..."
                     [matChipInputFor]="chipGrid"
                     (matChipInputTokenEnd)="addChip(field.key, $event)">
            </mat-chip-grid>
          </mat-form-field>

          <div *ngIf="field.type === 'select-chips'" class="form-field select-chips-field">
            <mat-form-field>
              <mat-label>{{ field.label }}</mat-label>
              <mat-select [value]="''" (selectionChange)="addChipFromSelect(field.key, $event.value)">
                <mat-option value="">Selecione um {{ field.label.toLowerCase() }}</mat-option>
                <mat-option *ngFor="let option of getAvailableOptions(field)" [value]="option.value">
                  {{ option.label }}
                </mat-option>
              </mat-select>
            </mat-form-field>
            
            <div class="chips-display" *ngIf="form.get(field.key)?.value?.length > 0">
              <mat-chip-set>
                <mat-chip *ngFor="let item of form.get(field.key)?.value" 
                          (removed)="removeChip(field.key, item)"
                          class="course-chip">
                  {{item}}
                  <button matChipRemove>
                    <mat-icon>cancel</mat-icon>
                  </button>
                </mat-chip>
              </mat-chip-set>
            </div>
          </div>
        </ng-container>

        <div class="form-actions">
          <button mat-button type="button" (click)="onCancel.emit()" class="cancel-btn">Cancelar</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="!form.valid" class="submit-btn">
            {{ submitLabel }}
          </button>
        </div>
      </div>
    </form>
  `,
  styles: [`
    .form-wrapper {
      width: 100%;
      overflow-x: hidden;
    }

    .form-container {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
      padding: 16px;
      width: 100%;
    }

    .form-field {
      width: 100%;
    }

    .form-actions {
      grid-column: 1 / -1;
      display: flex;
      flex-direction: column-reverse;
      gap: 12px;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid rgba(0, 0, 0, 0.12);
    }

    .cancel-btn, .submit-btn {
      width: 100%;
      min-height: 48px;
    }

    @media (min-width: 600px) {
      .form-container {
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
        padding: 24px;
      }

      .form-actions {
        gap: 16px;
        flex-direction: row;
        justify-content: flex-end;
      }

      .cancel-btn, .submit-btn {
        width: auto;
        min-height: 40px;
      }
    }

    @media (min-width: 900px) {
      .form-container {
        grid-template-columns: repeat(3, 1fr);
        gap: 24px;
        padding: 24px;
      }
    }

    .select-chips-field {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .chips-display {
      margin-top: 8px;
    }

    .course-chip {
      margin: 2px;
      background-color: #e3f2fd !important;
      color: #1976d2 !important;
    }

    @media (max-width: 600px) {
      .form-container {
        padding: 16px;
      }
    }
  `]
})
export class DataFormComponent {
  @Input() fields: {
    key: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'chips' | 'select-chips';
    options?: { value: any; label: string }[];
    required?: boolean;
  }[] = [];

  @Input() initialValue: any = {};
  @Input() submitLabel = 'Salvar';

  @Output() onSubmit = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({});
  }

  ngOnInit() {
    this.fields.forEach(field => {
      const validators = [];
      if (field.required) {
        validators.push(Validators.required);
      }
      
      let initialValue;
      if (field.type === 'chips') {
        initialValue = (this.initialValue && this.initialValue[field.key]) || [];
      } else if (field.type === 'number') {
        initialValue = (this.initialValue && this.initialValue[field.key]) || 0;
      } else if (field.type === 'date') {
        initialValue = (this.initialValue && this.initialValue[field.key]) || new Date();
      } else {
        initialValue = (this.initialValue && this.initialValue[field.key]) || '';
      }
      
      this.form.addControl(field.key, this.fb.control(initialValue, validators));
    });
  }

  submit() {
    if (this.form.valid) {
      this.onSubmit.emit(this.form.value);
    }
  }

  addChip(controlName: string, event: any) {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      const control = this.form.get(controlName);
      const currentValue = control?.value || [];
      control?.setValue([...currentValue, value.trim()]);
    }

    if (input) {
      input.value = '';
    }
  }

  removeChip(controlName: string, item: string) {
    const control = this.form.get(controlName);
    const currentValue = control?.value || [];
    const index = currentValue.indexOf(item);

    if (index >= 0) {
      const newValue = [...currentValue];
      newValue.splice(index, 1);
      control?.setValue(newValue);
    }
  }

  addChipFromSelect(controlName: string, value: string) {
    if (value && value.trim()) {
      const control = this.form.get(controlName);
      const currentValue = control?.value || [];
      
      // Verifica se o item já existe
      if (!currentValue.includes(value)) {
        control?.setValue([...currentValue, value]);
      }
    }
  }

  getAvailableOptions(field: any) {
    const control = this.form.get(field.key);
    const currentValue = control?.value || [];
    
    // Filtra opções já selecionadas
    return field.options?.filter((option: any) => !currentValue.includes(option.value)) || [];
  }
}