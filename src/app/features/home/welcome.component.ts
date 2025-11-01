import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="welcome-container">
      <div class="hero-section">
        <div class="logo-container">
          <img src="assets/images/logo_amemiya.png" alt="Logo Amemiya" class="logo">
        </div>
        <h1>Sistema de Gestão de Empilhadeiras</h1>
        <p class="subtitle">Controle eficiente de equipamentos e operadores</p>
        <div class="cta-buttons">
          <a mat-raised-button color="primary" routerLink="/dashboard" class="dashboard-button">
            <mat-icon>dashboard</mat-icon>
            Ver Dashboard
          </a>
          <a mat-raised-button color="accent" routerLink="/forklifts">
            <mat-icon>engineering</mat-icon>
            Gerenciar Empilhadeiras
          </a>
        </div>
      </div>

      <div class="purpose-section">
        <h2>Transforme a Gestão da sua Frota</h2>
        
        <div class="benefits-grid">
          <div class="benefit-card">
            <mat-icon>trending_up</mat-icon>
            <h3>Aumente a Produtividade</h3>
            <p>Monitore em tempo real o uso de equipamentos, identifique gargalos e otimize a distribuição de recursos para maximizar a eficiência operacional.</p>
          </div>

          <div class="benefit-card">
            <mat-icon>verified</mat-icon>
            <h3>Garanta a Segurança</h3>
            <p>Acompanhe certificações dos operadores, registre manutenções preventivas e mantenha sua equipe e equipamentos seguros e em conformidade.</p>
          </div>

          <div class="benefit-card">
            <mat-icon>insights</mat-icon>
            <h3>Tome Decisões Inteligentes</h3>
            <p>Análise detalhada de utilização, custos e performance para embasar decisões estratégicas e planejamento de manutenção.</p>
          </div>
        </div>

        <div class="features-highlight">
          <h3>Recursos Principais</h3>
          <ul>
            <li><mat-icon>check_circle</mat-icon> Dashboard em tempo real com status de toda a frota</li>
            <li><mat-icon>check_circle</mat-icon> Controle de manutenções preventivas e corretivas</li>
            <li><mat-icon>check_circle</mat-icon> Gestão de operadores e suas certificações</li>
            <li><mat-icon>check_circle</mat-icon> Histórico completo de operações e manutenções</li>
            <li><mat-icon>check_circle</mat-icon> Relatórios detalhados de utilização</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .welcome-container {
      min-height: calc(100vh - 64px - 64px);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 48px 20px;
      /* slightly darker, richer gradient to increase contrast */
      background: linear-gradient(135deg, #0b3d91 0%, #1565c0 100%);
      color: #ffffff;
    }

    .hero-section {
      text-align: center;
      max-width: 900px;
      margin: 0 auto 1.5rem auto;
    }

    .logo-container {
      margin-bottom: 1.25rem;
    }

    .logo {
      max-width: 280px;
      height: auto;
      margin-bottom: 0.75rem;
      border-radius: 8px;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
      background: #ffffff;
      padding: 0.75rem;
    }

    h1 {
      font-size: 2.4rem;
      margin-bottom: 12px;
      font-weight: 500;
      color: #ffffff;
      text-shadow: 0 1px 2px rgba(0,0,0,0.2);
    }

    .subtitle {
      font-size: 1.125rem;
      margin-bottom: 20px;
      color: rgba(255,255,255,0.95);
      font-weight: 300;
    }

    .cta-buttons a[mat-raised-button] {
      min-width: 180px;
    }

    .cta-buttons {
      display: flex;
      gap: 12px; /* spacing between dashboard and forklifts buttons */
      justify-content: center;
      align-items: center;
    }

    /* Ensure mat-icon inside CTA and feature areas are not clipped */
    .cta-buttons a[mat-raised-button] mat-icon,
    .benefit-card mat-icon,
    .features-highlight mat-icon,
    .features-highlight li mat-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      vertical-align: middle;
      line-height: 1;
      height: auto;
      width: auto;
    }

    /* Purpose section: make it a white card with dark text for contrast */
    .purpose-section {
      margin-top: 2.5rem;
      padding: 2.25rem;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 6px 24px rgba(16,24,40,0.08);
      color: #1f2937; /* dark slate */
      max-width: 1200px;
      width: 100%;
    }

    .purpose-section h2 {
      font-size: 2rem;
      margin-bottom: 1.5rem;
      font-weight: 600;
      text-align: center;
      color: #0f172a;
    }

    .benefits-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.25rem;
      margin-bottom: 1.75rem;
    }

    .benefit-card {
      padding: 1.25rem;
      background: #fafafa;
      border-radius: 10px;
      text-align: center;
      transition: transform 0.22s ease, box-shadow 0.22s ease;
      box-shadow: 0 2px 8px rgba(15,23,42,0.04);
      color: #0f172a;
    }

    .benefit-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 8px 26px rgba(15,23,42,0.08);
    }

    .benefit-card mat-icon {
      font-size: 2.25rem;
      margin-bottom: 0.75rem;
      color: #1565c0; /* primary accent */
    }

    .benefit-card h3 {
      font-size: 1.125rem;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #0b2540;
    }

    .benefit-card p {
      font-size: 0.975rem;
      line-height: 1.6;
      color: #334155;
    }

    .features-highlight {
      background: #ffffff;
      padding: 1.25rem 1rem;
      border-radius: 10px;
      margin-top: 1.5rem;
      box-shadow: 0 2px 12px rgba(15,23,42,0.04);
    }

    .features-highlight h3 {
      font-size: 1.25rem;
      margin-bottom: 1rem;
      text-align: center;
      font-weight: 600;
      color: #0b2540;
    }

    .features-highlight ul {
      list-style: none;
      padding: 0;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 0.75rem;
    }

    .features-highlight li {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1rem;
      padding: 0.5rem 0.25rem;
      color: #0b2540;
      /* ensure the icon has room and doesn't cause wrapping or clipping */
      min-width: 0; /* allow flex to shrink where necessary */
    }

    /* give icons a stable layout and a small reserved area so they don't get clipped on narrow columns */
    .features-highlight li mat-icon {
      flex: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      min-width: 28px;
      font-size: 20px;
      margin-right: 8px;
    }

    .features-highlight mat-icon {
      color: #1565c0;
    }

    @media (max-width: 768px) {
      h1 {
        font-size: 1.75rem;
      }

      .subtitle {
        font-size: 1rem;
      }

      .cta-buttons {
        flex-direction: column;
        width: 100%;
        max-width: 320px;
        margin: 0 auto;
    }
      .dashboard-button {
        margin-right: 12px
      }
    

      .purpose-section {
        padding: 1.25rem;
        margin-top: 1.25rem;
      }

      .purpose-section h2 {
        font-size: 1.5rem;
      }

      .benefits-grid {
        grid-template-columns: 1fr;
      }

      .features-highlight ul {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class WelcomeComponent {}