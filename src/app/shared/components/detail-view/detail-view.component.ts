import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { BrDatePipe } from '../../pipes/br-date.pipe';

@Component({
  selector: 'app-detail-view',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    BrDatePipe
  ],
  template: `
    <mat-card class="detail-card">
      <mat-card-header>
        <div mat-card-avatar>
          <mat-icon>{{ icon }}</mat-icon>
        </div>
        <mat-card-title>{{ data[titleField] }}</mat-card-title>
        <mat-card-subtitle>{{ data[subtitleField] }}</mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <div class="content-grid">
          <ng-container *ngFor="let field of fields">
            <div class="field" *ngIf="field.key !== titleField && field.key !== subtitleField">
              <strong>{{ field.label }}:</strong>
              <ng-container [ngSwitch]="field.type">
                <span *ngSwitchCase="'date'">{{ data[field.key] | brDate }}</span>
                <mat-chip *ngSwitchCase="'status'" [class]="data[field.key]">
                  {{ data[field.key] }}
                </mat-chip>
                <span *ngSwitchCase="'array'">
                  <mat-chip-set>
                    <mat-chip *ngFor="let item of data[field.key]">{{ item }}</mat-chip>
                  </mat-chip-set>
                </span>
                <span *ngSwitchDefault>{{ data[field.key] }}</span>
              </ng-container>
            </div>
          </ng-container>
        </div>
      </mat-card-content>

      <mat-divider></mat-divider>

      <mat-card-actions align="end" class="card-actions">
        <button mat-button color="accent" (click)="onEdit.emit(data)">
          <mat-icon>edit</mat-icon>
          <span class="action-text">Editar</span>
        </button>
        <button mat-button color="warn" (click)="onDelete.emit(data)">
          <mat-icon>delete</mat-icon>
          <span class="action-text">Deletar</span>
        </button>
        <button mat-button (click)="onBack.emit()">
          <mat-icon>arrow_back</mat-icon>
          <span class="action-text">Voltar</span>
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .detail-card {
      margin: 20px;
      max-width: 100%;
      width: 100%;
      padding: 0;
    }

    mat-card-header {
      padding: 24px;
    }

    mat-card-content {
      padding: 0 24px 24px;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
      padding: 20px 0;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
      background-color: #f9f9f9;
      border-radius: 4px;
    }

    .field strong {
      color: rgba(0, 0, 0, 0.7);
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .card-actions {
      display: flex;
      gap: 8px;
      padding: 8px;
      justify-content: space-between;
      flex-wrap: wrap;
    }

    .card-actions button {
      flex: 1;
      min-width: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .action-text {
      display: none;
    }

    .active { background-color: #c8e6c9 !important; }
    .inactive { background-color: #ffcdd2 !important; }
    .available { background-color: #c8e6c9 !important; }
    .in-use { background-color: #bbdefb !important; }
    .maintenance { background-color: #ffe0b2 !important; }

    mat-card-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f5f5f5;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      margin-right: 16px;
    }

    mat-card-avatar mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    @media (min-width: 600px) {
      .detail-card {
        margin: 24px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .content-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .card-actions button {
        flex: none;
      }

      .action-text {
        display: inline;
      }
    }

    @media (min-width: 1000px) {
      .content-grid {
        grid-template-columns: repeat(3, 1fr);
      }

      .detail-card {
        max-width: 1200px;
        margin: 24px auto;
      }
    }

    mat-card-header mat-icon {
      font-size: 28px;
    }
  `]
})
export class DetailViewComponent {
  @Input() data: any;
  @Input() fields: { key: string; label: string; type?: 'text' | 'date' | 'status' | 'array' }[] = [];
  @Input() titleField = 'name';
  @Input() subtitleField = 'position';
  @Input() icon = 'person';
  
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() onBack = new EventEmitter<void>();
}