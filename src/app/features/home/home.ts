import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { Chart } from 'chart.js/auto';
import { DashboardService } from '../../core/services/dashboard.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatGridListModule
  ],
  template: `
    <div class="container">
      <div class="dashboard-grid">
        <!-- Quick Stats -->
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon">
              <mat-icon color="primary">engineering</mat-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{totalForklifts}}</div>
              <div class="stat-label">Empilhadeiras</div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon">
              <mat-icon color="accent">people</mat-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{totalEmployees}}</div>
              <div class="stat-label">Funcionários</div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon">
              <mat-icon color="warn">warning</mat-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{maintenanceCount}}</div>
              <div class="stat-label">Em Manutenção</div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon">
              <mat-icon color="primary">check_circle</mat-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{availableCount}}</div>
              <div class="stat-label">Disponíveis</div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Charts -->
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Status das Empilhadeiras</mat-card-title>
          </mat-card-header>
          <mat-card-content>
              <div class="chart-controls">
                <div class="timer">Atualiza em: <strong>{{ secondsLeft }}s</strong></div>
                <button mat-icon-button color="primary" (click)="onManualRefresh()" aria-label="Atualizar agora">
                  <mat-icon>refresh</mat-icon>
                </button>
              </div>
              <div class="chart-wrapper">
                <canvas id="statusChart"></canvas>
              </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Certificações dos Funcionários</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="chart-wrapper">
              <canvas id="certificationsChart"></canvas>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Quick Actions -->
        <mat-card class="actions-card">
          <mat-card-header>
            <mat-card-title>Ações Rápidas</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="quick-actions">
              <a mat-raised-button color="primary" routerLink="/forklifts/new">
                <mat-icon>add</mat-icon>
                Nova Empilhadeira
              </a>
              <a mat-raised-button color="accent" routerLink="/employees/new">
                <mat-icon>person_add</mat-icon>
                Novo Funcionário
              </a>
              <button mat-raised-button color="warn">
                <mat-icon>report</mat-icon>
                Relatório de Manutenção
              </button>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Recent Activity -->
        <mat-card class="activity-card">
          <mat-card-header>
            <mat-card-title>Atividade Recente</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="activity-list">
              <div class="activity-item" *ngFor="let activity of recentActivities">
                <mat-icon [color]="activity.color">{{activity.icon}}</mat-icon>
                <div class="activity-details">
                  <div class="activity-message">{{activity.message}}</div>
                  <div class="activity-time">{{activity.time | date:'short'}}</div>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      padding: 20px;
    }

    .stat-card {
      mat-card-content {
        display: flex;
        align-items: center;
        padding: 16px;
      }

      .stat-icon {
        margin-right: 16px;

        mat-icon {
          font-size: 48px;
          width: 48px;
          height: 48px;
        }
      }

      .stat-content {
        .stat-value {
          font-size: 24px;
          font-weight: bold;
        }
        .stat-label {
          color: rgba(0, 0, 0, 0.6);
        }
      }
    }

    .chart-card {
      grid-column: span 2;
      height: 520px; /* increased for more space */
      overflow: visible;
      display: flex;
      flex-direction: column;
    }

    .chart-card .chart-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 8px 12px;
    }

    .chart-card .chart-controls .timer {
      font-size: 0.95rem;
    }

    .chart-card mat-card-content {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      padding: 8px 12px 12px 12px;
      min-height: 0;
    }

    .chart-card .chart-wrapper {
      flex: 1 1 auto;
      min-height: 0;
      display: flex;
      align-items: stretch;
      justify-content: center;
      position: relative;
    }

    .chart-card .chart-wrapper canvas {
      width: 100% !important;
      height: 100% !important;
      max-height: 100% !important;
    }

    @media (max-width: 1200px) {
      .chart-card {
        height: 420px;
      }
    }

    @media (max-width: 768px) {
      .chart-card {
        height: 360px;
      }
      .chart-card .chart-controls {
        margin: 6px 8px;
      }
    }

    .actions-card {
      grid-column: span 2;

      .quick-actions {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;

        [mat-raised-button] {
          flex: 1;
          min-width: 200px;
        }
      }
    }

    .activity-card {
      grid-column: span 2;

      .activity-list {
        max-height: 300px;
        overflow-y: auto;
      }

      .activity-item {
        display: flex;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);

        mat-icon {
          margin-right: 16px;
        }

        .activity-details {
          flex: 1;

          .activity-time {
            color: rgba(0, 0, 0, 0.6);
            font-size: 12px;
          }
        }
      }
    }

    @media (max-width: 1200px) {
      .dashboard-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .stat-card {
        grid-column: span 1;
      }
    }

    @media (max-width: 600px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }

      .chart-card,
      .actions-card,
      .activity-card {
        grid-column: span 1;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  totalForklifts = 0;
  totalEmployees = 0;
  maintenanceCount = 0;
  availableCount = 0;

  // countdown for next automatic refresh (seconds)
  secondsLeft: number = 60;

  private timerSub: Subscription = new Subscription();

  recentActivities = [
    {
      icon: 'engineering',
      color: 'primary',
      message: 'Empilhadeira XL-2000 entrou em manutenção',
      time: new Date(2025, 9, 31, 14, 30)
    },
    {
      icon: 'person',
      color: 'accent',
      message: 'Novo operador certificado: João Silva',
      time: new Date(2025, 9, 31, 13, 15)
    },
    {
      icon: 'check_circle',
      color: 'primary',
      message: 'Manutenção concluída: Empilhadeira FL-100',
      time: new Date(2025, 9, 31, 11, 45)
    }
  ];

  private subscription: Subscription = new Subscription();

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    // create charts with initial empty values
    this.initializeCharts();

    // subscribe to mock dashboard data and update stats + charts every time data changes
    this.subscription = this.dashboardService.getDashboardData().subscribe(data => {
      this.totalForklifts = data.stats.totalForklifts;
      this.totalEmployees = data.stats.totalEmployees;
      this.maintenanceCount = data.stats.maintenanceCount;
      this.availableCount = data.stats.availableCount;

      // update status chart
      const statusChart = Chart.getChart('statusChart');
      if (statusChart) {
        statusChart.data.datasets[0].data = [
          data.forkliftStatus.available,
          data.forkliftStatus.inUse,
          data.forkliftStatus.maintenance
        ];
        statusChart.update();
      }

      // update certifications chart
      const certChart = Chart.getChart('certificationsChart');
      if (certChart) {
        certChart.data.datasets[0].data = [
          data.employeeCertifications.valid,
          data.employeeCertifications.expiring,
          data.employeeCertifications.expired
        ];
        certChart.update();
      }

      // reset visible countdown whenever new data arrives
      this.secondsLeft = 60;
    });

    // start visible countdown timer
    this.timerSub = interval(1000).subscribe(() => {
      if (this.secondsLeft > 0) {
        this.secondsLeft--;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.timerSub.unsubscribe();
  }

  onManualRefresh() {
    // For now just log placeholder (integration TODO)
    console.log('TODO: integrar com backend');
  }

  initializeCharts() {
    // Status Chart
    const legendPosition = (typeof window !== 'undefined' && window.innerWidth < 768) ? 'bottom' : 'right';
    new Chart('statusChart', {
      type: 'doughnut',
      data: {
        labels: ['Disponíveis', 'Em Uso', 'Manutenção'],
        datasets: [{
          data: [0, 0, 0],
          backgroundColor: ['#4CAF50', '#FFA726', '#F44336']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: legendPosition as any, labels: { boxWidth: 12 } }
        }
      }
    });

    // Certifications Chart
    new Chart('certificationsChart', {
      type: 'bar',
      data: {
        labels: ['Válidas', 'A Vencer', 'Vencidas'],
        datasets: [{
          label: 'Certificações',
          data: [0, 0, 0],
          backgroundColor: ['#4CAF50', '#FFA726', '#F44336']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } }
        },
        plugins: { legend: { display: false } }
      }
    });
  }
}
