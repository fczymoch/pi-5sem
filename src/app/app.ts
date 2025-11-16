import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent
  ],
  template: `
    <app-header></app-header>
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      width: 100%;
      overflow-x: hidden;
    }

    .main-content {
      padding: 84px 8px 68px;
      min-height: calc(100vh - 152px);
      width: 100%;
      overflow-x: hidden;
    }

    @media (min-width: 600px) {
      .main-content {
        padding: 84px 16px 68px;
      }
    }

    @media (min-width: 900px) {
      .main-content {
        padding: 84px 24px 68px;
      }
    }
  `]
})
export class AppComponent {}