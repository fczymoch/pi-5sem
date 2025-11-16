import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Chart } from 'chart.js/auto';
import { DashboardService } from '../../core/services/dashboard.service';
import { ActivityLog } from '../../core/models/activity-log';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatGridListModule,
    MatProgressBarModule
  ],
  template: `
    <div class="container">
      <!-- Connection Status -->
      <div class="connection-status" [class.connected]="isConnectedToApi" [class.disconnected]="!isConnectedToApi">
        <mat-icon>{{isConnectedToApi ? 'cloud_done' : 'cloud_off'}}</mat-icon>
        <span>{{connectionStatus}}</span>
      </div>

      <!-- Auto Refresh Timer -->
      <div class="refresh-timer">
        <div class="timer-content">
          <mat-icon>update</mat-icon>
          <span class="timer-text">Próxima atualização em: {{formatTime(timeRemaining)}}</span>
          <span class="timer-status" [class.loading]="isRefreshingData">{{refreshStatus}}</span>
        </div>
        <mat-progress-bar 
          mode="determinate" 
          [value]="progressValue"
          [color]="timeRemaining <= 5 ? 'accent' : 'primary'">
        </mat-progress-bar>
      </div>

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
            <canvas id="statusChart"></canvas>
          </mat-card-content>
        </mat-card>

        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Certificações dos Funcionários</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <canvas id="certificationsChart"></canvas>
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
              <a mat-raised-button routerLink="/forklifts">
                <mat-icon>view_list</mat-icon>
                Ver Empilhadeiras
              </a>
              <a mat-raised-button routerLink="/employees">
                <mat-icon>groups</mat-icon>
                Ver Funcionários
              </a>
              <!-- Hidden for future use - maintenance report button -->
              <!-- 
              <button mat-raised-button color="warn" style="display: none;">
                <mat-icon>report</mat-icon>
                Relatório de Manutenção
              </button>
              -->
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
                  <div class="activity-message">{{activity.description}}</div>
                  <div class="activity-entity">{{activity.entity}} • {{activity.operationType}}</div>
                  <div class="activity-time">{{activity.timestamp | date:'short'}}</div>
                </div>
              </div>
              <div class="no-activities" *ngIf="recentActivities.length === 0">
                <mat-icon>info</mat-icon>
                <span>Nenhuma atividade recente encontrada</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .connection-status {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      margin-bottom: 16px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .connection-status.connected {
      background-color: #e8f5e8;
      color: #2e7d32;
      border: 1px solid #4caf50;
    }

    .connection-status.disconnected {
      background-color: #fff3e0;
      color: #ef6c00;
      border: 1px solid #ff9800;
    }

    .connection-status mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .refresh-timer {
      background-color: #f5f5f5;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 16px;
      transition: all 0.3s ease;
    }

    .timer-content {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      font-size: 14px;
    }

    .timer-content mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #666;
    }

    .timer-text {
      font-weight: 500;
      color: #333;
    }

    .timer-status {
      margin-left: auto;
      font-size: 12px;
      color: #666;
      transition: all 0.3s ease;
    }

    .timer-status.loading {
      color: #2196F3;
      font-weight: 500;
    }

    .refresh-timer mat-progress-bar {
      height: 4px;
      border-radius: 2px;
    }

    .container {
      padding: 20px;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      padding: 20px;
    }

    .stat-card {
      grid-column: span 1;
    }

    .stat-card mat-card-content {
      display: flex;
      align-items: center;
      padding: 16px;
    }

    .stat-icon {
      margin-right: 16px;
    }

    .stat-icon mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }

    .stat-content .stat-value {
      font-size: 24px;
      font-weight: bold;
    }

    .stat-content .stat-label {
      color: rgba(0, 0, 0, 0.6);
    }

    .chart-card {
      grid-column: span 2;
      height: 400px;
    }

    .chart-card mat-card-content {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      padding: 8px 16px 16px 16px;
      min-height: 0;
    }

    .chart-card canvas {
      width: 100% !important;
      height: 100% !important;
      max-height: 100% !important;
    }

    .actions-card {
      grid-column: span 2;
    }

    .activity-card {
      grid-column: span 2;
    }

    .quick-actions {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .quick-actions [mat-raised-button] {
      flex: 1;
      min-width: 200px;
    }

    .activity-list {
      max-height: 300px;
      overflow-y: auto;
    }

    .activity-item {
      display: flex;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    }

    .activity-item:last-child {
      border-bottom: none;
    }

    .activity-item mat-icon {
      margin-right: 16px;
    }

    .activity-details {
      flex: 1;
    }

    .activity-details .activity-message {
      margin-bottom: 2px;
      font-weight: 500;
    }

    .activity-details .activity-entity {
      margin-bottom: 2px;
      color: rgba(0, 0, 0, 0.7);
      font-size: 13px;
    }

    .activity-details .activity-time {
      color: rgba(0, 0, 0, 0.6);
      font-size: 12px;
    }

    .no-activities {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      color: rgba(0, 0, 0, 0.6);
      font-style: italic;
    }

    .no-activities mat-icon {
      margin-right: 8px;
    }

    @media (max-width: 1200px) {
      .dashboard-grid {
        grid-template-columns: repeat(3, 1fr);
      }

      .chart-card {
        grid-column: span 3;
      }

      .actions-card,
      .activity-card {
        grid-column: span 3;
      }
    }

    @media (max-width: 768px) {
      .dashboard-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        padding: 16px;
      }

      .chart-card {
        grid-column: span 2;
        height: 300px;
      }

      .actions-card,
      .activity-card {
        grid-column: span 2;
      }

      .quick-actions {
        flex-direction: column;
      }

      .quick-actions [mat-raised-button] {
        min-width: unset;
      }
    }

    @media (max-width: 600px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }

      .stat-card,
      .chart-card,
      .actions-card,
      .activity-card {
        grid-column: span 1;
      }

      .timer-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
      }

      .timer-status {
        margin-left: 0;
        align-self: flex-end;
      }

      .refresh-timer {
        padding: 8px 12px;
      }
    }

    @media (max-width: 480px) {
      .timer-content {
        font-size: 12px;
      }

      .timer-text {
        font-size: 11px;
      }

      .timer-status {
        font-size: 10px;
      }

      .container {
        padding: 12px;
      }

      .refresh-timer {
        margin-bottom: 12px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  totalForklifts = 0;
  totalEmployees = 0;
  maintenanceCount = 0;
  availableCount = 0;

  recentActivities: ActivityLog[] = [];

  connectionStatus: string = 'Verificando...';
  isConnectedToApi: boolean = false;

  // Timer properties
  timeRemaining: number = 60; // 60 segundos
  progressValue: number = 100;
  refreshStatus: string = 'Aguardando...';
  isRefreshingData: boolean = false;

  private subscription: Subscription = new Subscription();
  private timerSubscription?: Subscription;
  private pendingData: any = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadDashboardData();
    this.loadRecentActivities();
    this.initCharts();
    this.monitorConnection();
    this.startRefreshTimer();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  private loadDashboardData() {
    this.subscription = this.dashboardService.getDashboardData().subscribe(data => {
      this.totalForklifts = data.stats.totalForklifts;
      this.totalEmployees = data.stats.totalEmployees;
      this.maintenanceCount = data.stats.maintenanceCount;
      this.availableCount = data.stats.availableCount;

      // Update charts with new data
      this.updateCharts(data);
    });
  }

  private loadRecentActivities() {
    console.log('🔄 Dashboard: Carregando atividades recentes...');
    this.subscription.add(
      this.dashboardService.getRecentActivities(5).subscribe(activities => {
        console.log('✅ Dashboard: Atividades recentes carregadas:', activities.length, 'itens');
        this.recentActivities = activities;
      })
    );
  }

  private monitorConnection() {
    this.subscription.add(
      this.dashboardService.getConnectionStatus().subscribe(status => {
        this.connectionStatus = status.message;
        this.isConnectedToApi = status.isConnected;
        console.log('🌐 Status da conexão:', status);
      })
    );
  }

  private initCharts() {
    setTimeout(() => {
      this.createStatusChart();
      this.createCertificationsChart();
    }, 100);
  }

  private createStatusChart() {
    const ctx = document.getElementById('statusChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Disponível', 'Em Uso', 'Manutenção'],
          datasets: [{
            data: [this.availableCount, this.totalForklifts - this.availableCount - this.maintenanceCount, this.maintenanceCount],
            backgroundColor: ['#4CAF50', '#2196F3', '#FF9800']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    }
  }

  private createCertificationsChart() {
    const ctx = document.getElementById('certificationsChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Válidas', 'A Vencer', 'Vencidas'],
          datasets: [{
            label: 'Certificações',
            data: [45, 8, 3],
            backgroundColor: ['#4CAF50', '#FFA726', '#F44336']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    }
  }

  private updateCharts(data: any) {
    // Update status chart
    const statusChart = Chart.getChart('statusChart');
    if (statusChart) {
      statusChart.data.datasets[0].data = [
        data.forkliftStatus?.available || this.availableCount,
        data.forkliftStatus?.inUse || (this.totalForklifts - this.availableCount - this.maintenanceCount),
        data.forkliftStatus?.maintenance || this.maintenanceCount
      ];
      statusChart.update();
    }

    // Update certifications chart  
    const certChart = Chart.getChart('certificationsChart');
    if (certChart && data.employeeCertifications) {
      certChart.data.datasets[0].data = [
        data.employeeCertifications.valid || 45,
        data.employeeCertifications.expiring || 8,
        data.employeeCertifications.expired || 3
      ];
      certChart.update();
    }
  }

  // Timer Methods
  private startRefreshTimer() {
    console.log('⏰ Iniciando timer de atualização automática');
    this.timeRemaining = 60;
    this.progressValue = 100;
    this.refreshStatus = 'Aguardando...';
    this.isRefreshingData = false;
    this.pendingData = null;

    // Timer que atualiza a cada segundo
    this.timerSubscription = interval(1000).subscribe(() => {
      this.timeRemaining--;
      this.progressValue = (this.timeRemaining / 60) * 100;

      // Busca dados quando faltam 5 segundos
      if (this.timeRemaining === 5 && !this.isRefreshingData) {
        this.refreshStatus = 'Carregando dados...';
        this.isRefreshingData = true;
        this.preloadDashboardData();
      }

      // Atualiza interface quando chega ao 0
      if (this.timeRemaining <= 0) {
        this.refreshStatus = 'Atualizando...';
        this.applyPendingData();
        this.resetTimer();
      }
    });
  }

  private preloadDashboardData() {
    console.log('🔄 Pré-carregando dados do dashboard...');
    
    // Carrega dados do dashboard
    this.dashboardService.getDashboardData().subscribe(data => {
      console.log('✅ Dados do dashboard pré-carregados');
      this.pendingData = { ...this.pendingData, dashboardData: data };
    });

    // Carrega atividades recentes
    this.dashboardService.getRecentActivities(5).subscribe(activities => {
      console.log('✅ Atividades recentes pré-carregadas');
      this.pendingData = { ...this.pendingData, activities: activities };
    });
  }

  private applyPendingData() {
    if (this.pendingData) {
      console.log('🔄 Aplicando dados pré-carregados na interface');
      
      // Aplica dados do dashboard se disponíveis
      if (this.pendingData.dashboardData) {
        const data = this.pendingData.dashboardData;
        this.totalForklifts = data.stats.totalForklifts;
        this.totalEmployees = data.stats.totalEmployees;
        this.maintenanceCount = data.stats.maintenanceCount;
        this.availableCount = data.stats.availableCount;
        this.updateCharts(data);
      }

      // Aplica atividades se disponíveis
      if (this.pendingData.activities) {
        this.recentActivities = this.pendingData.activities;
      }

      console.log('✅ Dados aplicados com sucesso');
    } else {
      console.log('⚠️ Nenhum dado pré-carregado para aplicar');
    }
  }

  private resetTimer() {
    console.log('🔄 Reiniciando timer de atualização');
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    
    // Pequeno delay para mostrar o estado "Atualizando..."
    setTimeout(() => {
      this.startRefreshTimer();
    }, 1000);
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}