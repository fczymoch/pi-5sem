import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, MatToolbarModule],
  template: `
    <mat-toolbar class="footer">
      <div class="footer-content">
        <span>&copy; 2025 Sistema de Gestão de Empilhadeiras. Todos os direitos reservados.</span>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background-color: #f5f5f5;
      height: 48px;
      color: rgba(0, 0, 0, 0.87);
    }

    .footer-content {
      width: 100%;
      text-align: center;
      font-size: 14px;
    }

    @media (max-width: 600px) {
      .footer-content {
        font-size: 12px;
      }
    }
  `]
})
export class Footer {

}
