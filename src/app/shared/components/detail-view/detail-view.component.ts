import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-detail-view',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule
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
                <span *ngSwitchCase="'date'">{{ data[field.key] | date:'medium' }}</span>
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

      <mat-card-actions align="end">
        <button mat-button color="accent" (click)="onEdit.emit(data)">
          <mat-icon>edit</mat-icon> Edit
        </button>
        <button mat-button color="warn" (click)="onDelete.emit(data)">
          <mat-icon>delete</mat-icon> Delete
        </button>
        <button mat-button (click)="onBack.emit()">
          <mat-icon>arrow_back</mat-icon> Back
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .detail-card {
      margin: 20px;
      max-width: 1100px; /* increase width so details use more of the page */
      width: 100%;
    }

    .content-grid {
      display: grid;
      /* allow more responsive columns and avoid leaving large empty space */
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 24px;
      padding: 24px 0;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 8px;
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
      border-radius: 8px;
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