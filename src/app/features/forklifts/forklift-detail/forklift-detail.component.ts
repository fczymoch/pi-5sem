import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { DetailViewComponent } from '../../../shared/components/detail-view/detail-view.component';
import { DataGridComponent } from '../../../shared/components/data-grid/data-grid.component';
import { ForkliftService } from '../../../core/services/forklift.service';
import { ForkliftUsageService } from '../../../core/services/forklift-usage.service';
import { Forklift } from '../../../core/models/forklift';
import { ForkliftUsage } from '../../../core/models/forklift-usage';

interface ForkliftUsageWithDuration extends ForkliftUsage {
  duration: number;
}

@Component({
  selector: 'app-forklift-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    DetailViewComponent,
    DataGridComponent
  ],
  template: `
    <div class="detail-container">
      <mat-toolbar color="primary">
        <span>Detalhes da Empilhadeira</span>
      </mat-toolbar>

      <div class="detail-content" *ngIf="forklift">
        <app-detail-view
          [data]="getFormattedForklift()"
          [fields]="fields"
          icon="engineering"
          titleField="model"
          subtitleField="serialNumber"
          (onEdit)="editForklift($event)"
          (onDelete)="deleteForklift($event)"
          (onBack)="goBack()">
        </app-detail-view>

        <mat-card class="usage-section" *ngIf="currentUsage">
          <mat-card-header>
            <mat-card-title>Uso Atual</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="current-usage-info">
              <div class="current-user">
                <strong>Operador:</strong> {{currentUsage.employee?.name}}
                <br>
                <strong>Iniciado em:</strong> {{currentUsage.startTime | date:'short'}}
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="usage-section">
          <mat-card-header>
            <mat-card-title>Histórico de Uso</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <app-data-grid
              [data]="usageHistory"
              [columns]="usageColumns">
            </app-data-grid>
          </mat-card-content>
        </mat-card>

        <mat-card class="usage-stats" *ngIf="usageStats.length > 0">
          <mat-card-header>
            <mat-card-title>Estatísticas de Uso por Operador</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stats-grid">
              <div class="stat-item" *ngFor="let stat of usageStats">
                <div class="stat-header">
                  <span class="operator-name">{{stat.employeeName}}</span>
                  <span class="operator-position">{{stat.position}}</span>
                </div>
                <div class="stat-details">
                  <div class="stat-value">{{stat.totalHours}}h</div>
                  <div class="stat-label">Total de Horas</div>
                </div>
                <div class="stat-bar">
                  <div class="stat-progress" [style.width.%]="stat.percentage"></div>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .detail-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    mat-toolbar {
      width: 100%;
      margin-bottom: 20px;
    }

    .detail-content {
      width: 100%;
      max-width: 1200px;
      padding: 0 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .current-usage-info {
      padding: 16px;
    }

    .current-user {
      padding: 16px;
      background-color: #f5f5f5;
      border-radius: 8px;
      border-left: 4px solid #2196f3;
    }

    .status-badge.in-use {
      background-color: #2196f3;
      color: white;
    }

    .status-badge.maintenance {
      background-color: #ff9800;
      color: white;
    }

    .current-user {
      color: #666;
    }

    .stats-grid {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .stat-item {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
    }

    .stat-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .operator-name {
      font-weight: 500;
    }

    .operator-position {
      color: #666;
      font-size: 0.9em;
    }

    .stat-details {
      margin-bottom: 8px;
    }

    .stat-value {
      font-size: 1.5em;
      font-weight: 500;
      color: #1976d2;
    }

    .stat-label {
      font-size: 0.9em;
      color: #666;
    }

    .stat-bar {
      height: 4px;
      background: #e0e0e0;
      border-radius: 2px;
      overflow: hidden;
    }

    .stat-progress {
      height: 100%;
      background: #1976d2;
      transition: width 0.3s ease;
    }
  `]
})
export class ForkliftDetailComponent implements OnInit {
  forklift: Forklift | null = null;
  currentUsage: ForkliftUsage | null = null;
  usageHistory: Array<ForkliftUsage & { duration: number }> = [];
  usageStats: Array<{
    employeeId: number;
    employeeName: string;
    position: string;
    totalHours: number;
    usageCount: number;
    percentage: number;
  }> = [];

  usageColumns: { key: string; label: string; type?: 'text' | 'date' | 'status' }[] = [
    { key: 'employee.name', label: 'Operador', type: 'text' },
    { key: 'employee.position', label: 'Cargo', type: 'text' },
    { key: 'startTime', label: 'Início', type: 'date' },
    { key: 'endTime', label: 'Fim', type: 'date' },
    { key: 'duration', label: 'Duração (horas)', type: 'text' }
  ];
  fields: { key: string; label: string; type?: 'text' | 'date' | 'status' | 'array' }[] = [
    { key: 'model', label: 'Modelo', type: 'text' },
    { key: 'serialNumber', label: 'Número de Série', type: 'text' },
    { key: 'manufacturer', label: 'Fabricante', type: 'text' },
    { key: 'capacity', label: 'Capacidade (kg)', type: 'text' },
    { key: 'statusLabel', label: 'Status', type: 'text' },
    { key: 'location', label: 'Localização', type: 'text' },
    { key: 'lastMaintenanceDate', label: 'Última Manutenção', type: 'date' },
    { key: 'nextMaintenanceDate', label: 'Próxima Manutenção', type: 'date' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private forkliftService: ForkliftService,
    private usageService: ForkliftUsageService
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      // Carregar empilhadeira
      this.forkliftService.getForkliftById(id).subscribe((forklift: Forklift | undefined) => {
        this.forklift = forklift || null;
      });

      // Carregar uso atual
      this.usageService.getCurrentUsage(id).subscribe(usage => {
        this.currentUsage = usage || null;
      });

      // Carregar histórico de uso
      this.usageService.getForkliftHistory(id).subscribe(history => {
        console.log('📋 Histórico de uso carregado:', history.length, 'registros');
        this.usageHistory = history.map(usage => ({
          ...usage,
          // Usa a duração da API se disponível, senão calcula
          duration: (usage as any).duracaoHoras || this.calculateDuration(usage.startTime, usage.endTime)
        }));
        this.calculateUsageStats(history);
      });
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'available': return 'Disponível';
      case 'inUse': return 'Em Uso';
      case 'maintenance': return 'Manutenção';
      default: return status;
    }
  }

  private calculateDuration(start: Date, end?: Date): number {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    return Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60) * 10) / 10;
  }

  private calculateUsageStats(history: ForkliftUsage[]) {
    const statsMap = new Map<number, {
      employeeId: number;
      employeeName: string;
      position: string;
      totalHours: number;
      usageCount: number;
    }>();

    history.forEach(usage => {
      if (usage.employee) {
        const key = usage.employee.id;
        const current = statsMap.get(key) || {
          employeeId: usage.employee.id,
          employeeName: usage.employee.name,
          position: usage.employee.position,
          totalHours: 0,
          usageCount: 0
        };

        // Usa a duração da API se disponível, senão calcula
        const duration = (usage as any).duracaoHoras || this.calculateDuration(usage.startTime, usage.endTime);
        current.totalHours += duration;
        current.usageCount++;
        statsMap.set(key, current);
      }
    });

    // Converter para array e calcular percentagens
    const stats = Array.from(statsMap.values());
    const maxHours = Math.max(...stats.map(s => s.totalHours));

    this.usageStats = stats
      .sort((a, b) => b.totalHours - a.totalHours)
      .map(stat => ({
        ...stat,
        totalHours: Math.round(stat.totalHours * 10) / 10,
        percentage: (stat.totalHours / maxHours) * 100
      }));
  }

  loadForklift(id: number) {
    this.forkliftService.getForkliftById(id).subscribe((forklift: Forklift | undefined) => {
      this.forklift = forklift || null;
    });
  }

  editForklift(forklift: Forklift) {
    this.router.navigate(['/forklifts', forklift.id, 'edit']);
  }

  deleteForklift(forklift: Forklift) {
    if (confirm('Tem certeza que deseja excluir esta empilhadeira?')) {
      this.forkliftService.deleteForklift(forklift.id).subscribe(() => {
        this.goBack();
      });
    }
  }

  goBack() {
    this.router.navigate(['/forklifts']);
  }

  getFormattedForklift() {
    if (!this.forklift) return null;
    return {
      ...this.forklift,
      statusLabel: this.getStatusLabel(this.forklift.status)
    };
  }

  transformBooleanValue(value: boolean): string {
    return value ? 'Sim' : 'Não';
  }
}