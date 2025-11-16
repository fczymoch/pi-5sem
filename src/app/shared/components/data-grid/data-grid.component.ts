import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BrDatePipe } from '../../pipes/br-date.pipe';

@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatTooltipModule,
    BrDatePipe
  ],
  template: `
    <div class="data-grid-container">
      <!-- Desktop View -->
      <div class="desktop-view" *ngIf="!isMobile">
        <div class="mat-elevation-z8">
          <table mat-table [dataSource]="data" matSort>
            <ng-container *ngFor="let column of columns" [matColumnDef]="column.key">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ column.label }}</th>
              <td mat-cell *matCellDef="let element">
                <ng-container [ngSwitch]="column.type">
                  <span *ngSwitchCase="'date'">{{ element[column.key] | brDate }}</span>
                  <span *ngSwitchCase="'status'">
                    <mat-icon [class]="element[column.key]">
                      {{ getStatusIcon(element[column.key]) }}
                    </mat-icon>
                  </span>
                  <span *ngSwitchDefault>{{ getNestedValue(element, column.key) }}</span>
                </ng-container>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Ações</th>
              <td mat-cell *matCellDef="let element">
                <button mat-icon-button color="primary" (click)="onView.emit(element)" matTooltip="Ver">
                  <mat-icon>visibility</mat-icon>
                </button>
                <button mat-icon-button color="accent" (click)="onEdit.emit(element)" matTooltip="Editar">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="onDelete.emit(element)" matTooltip="Deletar">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>

          <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]"
                         aria-label="Selecione uma página">
          </mat-paginator>
        </div>
      </div>

      <!-- Mobile View -->
      <div class="mobile-view" *ngIf="isMobile">
        <div class="cards-container">
          <mat-card class="data-card" *ngFor="let item of data">
            <mat-card-header>
              <mat-card-title>
                {{ getNestedValue(item, columns[0]?.key || '') }}
              </mat-card-title>
              <mat-card-subtitle *ngIf="columns[1]">
                {{ getNestedValue(item, columns[1]?.key || '') }}
              </mat-card-subtitle>
            </mat-card-header>

            <mat-card-content>
              <div class="card-field" *ngFor="let column of columns.slice(2)">
                <div class="field-label">{{ column.label }}</div>
                <div class="field-value">
                  <ng-container [ngSwitch]="column.type">
                    <span *ngSwitchCase="'date'">{{ item[column.key] | brDate }}</span>
                    <span *ngSwitchCase="'status'" [class]="'status-' + item[column.key]">
                      {{ item[column.key] }}
                    </span>
                    <span *ngSwitchDefault>{{ getNestedValue(item, column.key) }}</span>
                  </ng-container>
                </div>
              </div>
            </mat-card-content>

            <mat-divider></mat-divider>

            <mat-card-actions>
              <button mat-button color="primary" (click)="onView.emit(item)">
                <mat-icon>visibility</mat-icon>
                Ver
              </button>
              <button mat-button color="accent" (click)="onEdit.emit(item)">
                <mat-icon>edit</mat-icon>
                Editar
              </button>
              <button mat-button color="warn" (click)="onDelete.emit(item)">
                <mat-icon>delete</mat-icon>
                Deletar
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .data-grid-container {
      width: 100%;
      overflow-x: auto;
    }

    .desktop-view {
      display: none;
    }

    .mobile-view {
      display: block;
    }

    .cards-container {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
      padding: 16px;
      width: 100%;
    }

    .data-card {
      width: 100%;
      margin: 0;
    }

    .card-field {
      margin-bottom: 12px;
    }

    .field-label {
      font-size: 0.75rem;
      color: rgba(0, 0, 0, 0.6);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }

    .field-value {
      font-size: 1rem;
      color: rgba(0, 0, 0, 0.87);
    }

    mat-card-actions {
      display: flex;
      gap: 8px;
      padding: 8px;
      justify-content: space-around;
    }

    mat-card-actions button {
      flex: 1;
      min-width: 60px;
    }

    .status-available { color: #4caf50; font-weight: 500; }
    .status-in-use { color: #2196f3; font-weight: 500; }
    .status-maintenance { color: #ff9800; font-weight: 500; }
    .status-active { color: #4caf50; font-weight: 500; }
    .status-inactive { color: #f44336; font-weight: 500; }

    .mat-elevation-z8 {
      border-radius: 8px;
      overflow: hidden;
    }

    table {
      width: 100%;
    }

    .active { color: #4caf50; }
    .inactive { color: #f44336; }
    .available { color: #4caf50; }
    .in-use { color: #2196f3; }
    .maintenance { color: #ff9800; }

    @media (min-width: 600px) {
      .desktop-view {
        display: block;
      }

      .mobile-view {
        display: none;
      }

      .cards-container {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .cards-container {
        grid-template-columns: repeat(3, 1fr);
      }
    }
  `]
})
export class DataGridComponent {
  @Input() data: any[] = [];
  @Input() columns: { key: string; label: string; type?: 'text' | 'date' | 'status' }[] = [];
  @Output() onView = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();

  isMobile = false;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe(Breakpoints.Handset).subscribe(result => {
      this.isMobile = result.matches;
    });
  }

  get displayedColumns(): string[] {
    return [...this.columns.map(col => col.key), 'actions'];
  }

  getStatusIcon(status: string): string {
    const statusIcons: { [key: string]: string } = {
      active: 'check_circle',
      inactive: 'cancel',
      available: 'engineering',
      'in-use': 'local_shipping',
      inUse: 'local_shipping',
      maintenance: 'build'
    };
    return statusIcons[status] || 'engineering';
  }

  getNestedValue(obj: any, key: string): any {
    if (!key) return '';
    return key.split('.').reduce((o, k) => (o || {})[k], obj) || '';
  }
}