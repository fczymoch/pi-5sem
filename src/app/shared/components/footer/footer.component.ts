import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatIconModule],
  template: `
    <mat-toolbar class="footer">
      <div class="footer-content">
        <div class="footer-section links">
          <a href="https://github.com/seu-usuario/pi_amemiya" target="_blank" class="social-link">
            <mat-icon>code</mat-icon>
            <span>GitHub</span>
          </a>
          <a href="mailto:contato@example.com" class="social-link">
            <mat-icon>email</mat-icon>
            <span>Contato</span>
          </a>
          <a href="/about" class="social-link">
            <mat-icon>info</mat-icon>
            <span>Sobre</span>
          </a>
        </div>
        <div class="footer-section copyright">
          <span>&copy; 2025 Sistema de Gestão de Empilhadeiras. Todos os direitos reservados.</span>
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .footer {
      /* not fixed: let footer flow with page content so it appears at the end when scrolling */
      position: static;
      background-color: #000000; /* black */
      min-height: 64px;
      color: white;
      padding: 16px 20px; /* slightly larger padding for spacing */
      box-shadow: 0 -2px 8px rgba(0,0,0,0.06);
      width: 100%;
      height: auto;
      margin-bottom: 0; /* ensure no extra gap below footer */
    }

    .footer-content {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    .footer-section {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    /* add margin-top specifically for link sections so links and copyright are separated */
    .footer-section.links {
      margin-top: 8px;
    }

    .social-link {
      display: flex;
      align-items: center;
      gap: 4px;
      color: white;
      text-decoration: none;
      transition: opacity 0.2s;
    }

    .social-link:hover {
      opacity: 0.8;
    }

    .social-link mat-icon {
      font-size: 20px;
      height: 20px;
      width: 20px;
      display: inline-flex;
      vertical-align: middle;
    }

    .copyright {
      font-size: 12px;
      opacity: 0.9;
    }

    @media (max-width: 600px) {
      .footer-content {
        font-size: 12px;
      }
    }
  `]
})
export class FooterComponent {}