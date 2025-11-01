import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { WelcomeComponent } from './welcome.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    WelcomeComponent
  ],
  template: `
    <app-welcome></app-welcome>

    <div class="features-container">
      <h2>Recursos do Sistema</h2>
      <div class="features-grid">
        <div class="grid-item">
          <mat-card class="feature-card">
            <mat-card-header>
              <div class="icon-container">
                <mat-icon>dashboard</mat-icon>
              </div>
              <mat-card-title>Dashboard</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>Visualize indicadores e status em tempo real do sistema.</p>
            </mat-card-content>
            <mat-card-actions>
              <a mat-flat-button color="primary" routerLink="/dashboard">
                <mat-icon>visibility</mat-icon>
                Acessar Dashboard
              </a>
            </mat-card-actions>
          </mat-card>
        </div>

        <div class="grid-item">
          <mat-card class="feature-card">
            <mat-card-header>
              <div class="icon-container">
                <mat-icon>forklift</mat-icon>
              </div>
              <mat-card-title>Empilhadeiras</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>Gerencie sua frota de empilhadeiras e monitore o status.</p>
            </mat-card-content>
            <mat-card-actions>
              <a mat-flat-button color="primary" routerLink="/forklifts">
                <mat-icon>visibility</mat-icon>
                Ver Empilhadeiras
              </a>
            </mat-card-actions>
          </mat-card>
        </div>

        <div class="grid-item">
          <mat-card class="feature-card">
            <mat-card-header>
              <div class="icon-container">
                <mat-icon>people</mat-icon>
              </div>
              <mat-card-title>Funcionários</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>Controle de operadores, certificações e treinamentos.</p>
            </mat-card-content>
            <mat-card-actions>
              <a mat-flat-button color="primary" routerLink="/employees">
                <mat-icon>visibility</mat-icon>
                Ver Funcionários
              </a>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .features-container {
      padding: 3rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
      text-align: center;
      background: linear-gradient(to bottom, #f8f9fa, #ffffff);
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    h2 {
      font-size: 2.5rem;
      margin-bottom: 3rem;
      color: #1976d2;
      font-weight: 300;
      letter-spacing: 0.5px;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }

    .grid-item {
      display: flex;
    }

    .feature-card {
      flex: 1;
      display: flex;
      flex-direction: column;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      border-radius: 12px;
      overflow: hidden;
      background: #ffffff;
      border: none;
    }

    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    }

    mat-card-header {
      padding: 2rem 1.5rem 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .icon-container {
      background: linear-gradient(135deg, #1976d2, #64b5f6);
      width: 64px;
      height: 64px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
    }

    .icon-container mat-icon {
      color: white;
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    mat-card-title {
      margin: 0.5rem 0 !important;
      font-size: 1.5rem !important;
      font-weight: 500;
      color: #2c3e50;
    }

    mat-card-content {
      flex-grow: 1;
      padding: 0 1.5rem 1.5rem;
    }

    mat-card-content p {
      color: #6c757d;
      font-size: 1rem;
      line-height: 1.6;
      margin: 0;
    }

    mat-card-actions {
      padding: 1.5rem;
      display: flex;
      justify-content: center;
      border-top: 1px solid #f0f0f0;
    }

    mat-card-actions a {
      width: 100%;
      font-size: 1rem;
    }

    mat-card-actions mat-icon {
      margin-right: 0.5rem;
    }

    @media (max-width: 768px) {
      .features-container {
        padding: 2rem 1rem;
      }

      h2 {
        font-size: 2rem;
        margin-bottom: 2rem;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

      .feature-card:hover {
        transform: none;
      }
    }
  `]
})
export class LandingComponent {}