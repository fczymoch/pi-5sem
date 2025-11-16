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
      gap: 20px; 
      padding: 20px; 
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
    }
    .stat-card mat-card-content { 
      display: flex; 
      align-items: center; 
    }
    .quick-actions { 
      display: flex; 
      gap: 16px; 
      flex-wrap: wrap; 
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

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadDashboardData();
    this.startRefreshTimer();
    this.initCharts();
  }

  ngOnDestroy() {
    this.timerSub?.unsubscribe();
  }

  private loadDashboardData() {
    this.dashboardService.getDashboardData().subscribe(data => {
      this.totalForklifts = data.stats.totalForklifts;
      this.totalEmployees = data.stats.totalEmployees;
      this.maintenanceCount = data.stats.maintenanceCount;
      this.availableCount = data.stats.availableCount;
    });
  }

  private startRefreshTimer() {
    this.timerSub = interval(1000).subscribe(() => {
      this.secondsLeft--;
      if (this.secondsLeft <= 0) {
        this.loadDashboardData();
        this.secondsLeft = 60; // Reset timer
      }
    });
  }

  onManualRefresh() {
    this.loadDashboardData();
    this.secondsLeft = 60; // Reset timer
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
          labels: ['Operação de Empilhadeira', 'Segurança', 'Manutenção Básica', 'Controle de Qualidade'],
          datasets: [{
            label: 'Funcionários Certificados',
            data: [15, 12, 8, 6],
            backgroundColor: '#2196F3'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }
}
