import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule
  ],
  template: `
    <div class="menu-overlay" [class.visible]="isOpen" (click)="closeMenu()"></div>
    <nav class="side-menu" [class.open]="isOpen">
      <mat-nav-list>
        <a mat-list-item routerLink="/home" (click)="closeMenu()">
          <mat-icon matListItemIcon>home</mat-icon>
          <span matListItemTitle>Home</span>
        </a>
        <a mat-list-item routerLink="/employees" (click)="closeMenu()">
          <mat-icon matListItemIcon>people</mat-icon>
          <span matListItemTitle>Funcionários</span>
        </a>
        <a mat-list-item routerLink="/forklifts" (click)="closeMenu()">
          <mat-icon matListItemIcon>engineering</mat-icon>
          <span matListItemTitle>Empilhadeiras</span>
        </a>
      </mat-nav-list>
    </nav>
  `,
  styles: [`
    .menu-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 998;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;

      &.visible {
        opacity: 1;
        visibility: visible;
      }
    }

    .side-menu {
      position: fixed;
      top: 64px; // height of toolbar
      left: -280px;
      width: 280px;
      height: calc(100vh - 64px);
      background-color: white;
      z-index: 999;
      transition: left 0.3s ease;
      box-shadow: 2px 0 12px rgba(0, 0, 0, 0.1);

      &.open {
        left: 0;
      }
    }

    @media (max-width: 599px) {
      .side-menu {
        top: 56px; // height of toolbar on mobile
        height: calc(100vh - 56px);
      }
    }
  `]
})
export class NavMenuComponent {
  @Input() isOpen = false;
  @Output() menuClosed = new EventEmitter<void>();

  closeMenu() {
    this.menuClosed.emit();
  }

}
