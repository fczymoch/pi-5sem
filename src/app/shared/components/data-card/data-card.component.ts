import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { BrDatePipe } from '../../pipes/br-date.pipe';

@Component({
  selector: 'app-data-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    BrDatePipe
  ],
  template: `
    <mat-card class="data-card">
      <div class="card-image" *ngIf="icon">
        <div class="image-container" [class]="getStatusClass(data)">
          <mat-icon class="forklift-icon" [style.color]="getStatusColor(data['status'])">{{icon}}</mat-icon>
          <div class="status-indicator" [style.background-color]="getStatusColor(data['status'])"></div>
        </div>
      </div>

      <mat-card-header>
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
                <mat-chip-set *ngSwitchCase="'status'">
                  <mat-chip [style.background-color]="getStatusColor(data[field.key])" style="color: white; text-transform: capitalize">
                    {{ translateStatus(data[field.key]) }}
                  </mat-chip>
                </mat-chip-set>
                <span *ngSwitchDefault>{{ data[field.key] }}</span>
              </ng-container>
            </div>
          </ng-container>
        </div>
      </mat-card-content>

      <mat-card-actions align="end">
        <button mat-button color="primary" (click)="onView.emit(data)">
          <mat-icon>visibility</mat-icon> View
        </button>
        <button mat-button color="accent" (click)="onEdit.emit(data)">
          <mat-icon>edit</mat-icon> Edit
        </button>
        <button mat-button color="warn" (click)="onDelete.emit(data)">
          <mat-icon>delete</mat-icon> Delete
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .data-card {
      margin: 12px;
      max-width: 100%;
      width: 100%;
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
      padding: 16px;
      flex: 1;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 8px;
      background-color: #fafafa;
      border-radius: 4px;
    }

    .field strong {
      font-size: 0.75rem;
      color: rgba(0, 0, 0, 0.7);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    mat-card-header {
      padding: 16px;
      background-color: #f9f9f9;
    }

    mat-card-title {
      font-size: 1.25rem !important;
      margin-bottom: 4px !important;
      font-weight: 600;
    }

    mat-card-subtitle {
      font-size: 0.95rem !important;
      color: rgba(0, 0, 0, 0.6) !important;
    }

    .active { background-color: #2e7d32 !important; color: white !important; }
    .inactive { background-color: #d32f2f !important; color: white !important; }
    .available { background-color: #2e7d32 !important; color: white !important; }
    .in-use { background-color: #1565c0 !important; color: white !important; }
    .maintenance { background-color: #ef6c00 !important; color: white !important; }

    mat-chip {
      display: inline-flex;
      justify-content: center;
      text-align: center;
      text-transform: uppercase;
      font-weight: 500;
      font-size: 0.85em;
      padding: 4px 12px !important;
    }

    .card-image {
      padding: 12px;
      display: flex;
      justify-content: center;
      background-color: #f5f5f5;
    }

    .image-container {
      position: relative;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      border: 3px solid #e0e0e0;
    }

    .image-container.status-available {
      border-color: #4CAF50;
      background: rgba(76, 175, 80, 0.1);
    }

    .image-container.status-inUse {
      border-color: #FF9800;
      background: rgba(255, 152, 0, 0.1);
    }

    .image-container.status-maintenance {
      border-color: #F44336;
      background: rgba(244, 67, 54, 0.1);
    }

    .forklift-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .status-indicator {
      position: absolute;
      bottom: -2px;
      right: -2px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 3px solid white;
    }

    .forklift-default { background-color: #e0e0e0; }
    .forklift-forkmaster { background-color: #1976d2; }
    .forklift-hyster { background-color: #ffc107; }
    .forklift-toyota { background-color: #f44336; }
    .forklift-crown { background-color: #4caf50; }
    .forklift-yale { background-color: #9c27b0; }
    
    .forklift-default .forklift-icon,
    .forklift-forkmaster .forklift-icon { color: white; }
  `]
})
export class DataCardComponent {
  @Input() data: any;
  @Input() fields: { key: string; label: string; type?: 'text' | 'date' | 'status' }[] = [];
  @Input() titleField = 'name';
  @Input() subtitleField = 'position';
  @Input() icon = '';
  
  @Output() onView = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();

  getStatusClass(data: any): string {
    return `status-${data.status || 'available'}`;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'inUse':
        return '#FF9800'; // Orange for in use
      case 'maintenance':
        return '#F44336'; // Red for maintenance
      case 'available':
        return '#4CAF50'; // Green for available
      default:
        return '#757575'; // Grey for unknown status
    }
  }

  translateStatus(status: string): string {
    switch (status) {
      case 'inUse':
        return 'Em uso';
      case 'maintenance':
        return 'Manutenção';
      case 'available':
        return 'Disponível';
      default:
        return status;
    }
  }
}