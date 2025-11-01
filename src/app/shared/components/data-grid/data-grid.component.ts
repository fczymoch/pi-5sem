import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="mat-elevation-z8">
      <table mat-table [dataSource]="data" matSort>
        <ng-container *ngFor="let column of columns" [matColumnDef]="column.key">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ column.label }}</th>
          <td mat-cell *matCellDef="let element">
            <ng-container [ngSwitch]="column.type">
              <span *ngSwitchCase="'date'">{{ element[column.key] | date }}</span>
              <span *ngSwitchCase="'status'">
                <mat-icon [class]="element[column.key]">
                  {{ getStatusIcon(element[column.key]) }}
                </mat-icon>
              </span>
              <span *ngSwitchDefault>{{ element[column.key] }}</span>
            </ng-container>
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let element">
            <button mat-icon-button color="primary" (click)="onView.emit(element)">
              <mat-icon>visibility</mat-icon>
            </button>
            <button mat-icon-button color="accent" (click)="onEdit.emit(element)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="onDelete.emit(element)">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>

      <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]"
                     aria-label="Select page">
      </mat-paginator>
    </div>
  `,
  styles: [`
    table {
      width: 100%;
    }

    .mat-elevation-z8 {
      margin: 20px;
      border-radius: 8px;
      overflow: hidden;
    }

    .active { color: green; }
    .inactive { color: red; }
    .available { color: green; }
    .in-use { color: blue; }
    .maintenance { color: orange; }
  `]
})
export class DataGridComponent {
  @Input() data: any[] = [];
  @Input() columns: { key: string; label: string; type?: 'text' | 'date' | 'status' }[] = [];
  @Output() onView = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();

  get displayedColumns(): string[] {
    return [...this.columns.map(col => col.key), 'actions'];
  }

  getStatusIcon(status: string): string {
    const statusIcons: { [key: string]: string } = {
      active: 'check_circle',
      inactive: 'cancel',
      available: 'check_circle',
      'in-use': 'engineering',
      maintenance: 'build'
    };
    return statusIcons[status] || 'help';
  }
}