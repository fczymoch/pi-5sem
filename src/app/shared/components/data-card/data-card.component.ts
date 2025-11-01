import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-data-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  template: `
    <mat-card class="data-card">
      <div class="card-image" *ngIf="icon">
        <div class="image-container" [class]="getForkliftClass(data)">
          <mat-icon class="forklift-icon">{{icon}}</mat-icon>
          <div class="status-indicator" [class]="data['status']"></div>
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
                <span *ngSwitchCase="'date'">{{ data[field.key] | date }}</span>
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
      margin: 16px;
      max-width: 400px;
      width: 100%;
    }

    .content-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      padding: 20px 16px;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: flex-start;
    }

    .field strong {
      font-size: 0.9em;
      color: rgba(0, 0, 0, 0.6);
    }

    mat-card-header {
      padding: 16px 16px 0 16px;
    }

    mat-card-title {
      font-size: 1.4em !important;
      margin-bottom: 8px !important;
    }

    mat-card-subtitle {
      font-size: 1.1em !important;
    }

    .active { background-color: #2e7d32 !important; color: white !important; }
    .inactive { background-color: #d32f2f !important; color: white !important; }
    .available { background-color: #2e7d32 !important; color: white !important; }
    .in-use { background-color: #1565c0 !important; color: white !important; }
    .maintenance { background-color: #ef6c00 !important; color: white !important; }

    mat-chip {
      display: inline-flex;
      justify-content: center;
      min-width: 80px;
      text-align: center;
      text-transform: uppercase;
      font-weight: 500;
      font-size: 0.85em;
    }

    .card-image {
      padding: 16px;
      display: flex;
      justify-content: center;
    }

    .image-container {
      position: relative;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background-color: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .forklift-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
    }

    .status-indicator {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid white;
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

  getForkliftClass(data: any): string {
    if (data.status === 'maintenance') return 'maintenance';
    if (data.status === 'inUse') return 'in-use';
    return 'available';
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