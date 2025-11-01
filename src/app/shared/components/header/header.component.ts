import { Component, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatSidenavModule,
    MatListModule
  ],
  template: `
    <mat-toolbar color="primary" class="header">
      <div class="toolbar-container">
        <div class="mobile-nav" *ngIf="isMobile">
          <a routerLink="/" class="brand">
            <img src="assets/images/logo_amemiya.png" alt="Logo Amemiya" class="logo">
          </a>
          <button mat-icon-button (click)="sidenav.toggle()">
            <mat-icon>menu</mat-icon>
          </button>
        </div>

        <div class="desktop-container" *ngIf="!isMobile">
          <a routerLink="/" class="brand">
            <img src="assets/images/logo_amemiya.png" alt="Logo Amemiya" class="logo">
          </a>
          <nav class="desktop-nav">
            <a mat-button routerLink="/home" routerLinkActive="active">
              <mat-icon>home</mat-icon>
              <span>Home</span>
            </a>
            <a mat-button routerLink="/dashboard" routerLinkActive="active">
              <mat-icon>dashboard</mat-icon>
              <span>Dashboard</span>
            </a>
            <a mat-button routerLink="/employees" routerLinkActive="active">
              <mat-icon>people</mat-icon>
              <span>Funcionários</span>
            </a>
            <a mat-button routerLink="/forklifts" routerLinkActive="active">
              <mat-icon>engineering</mat-icon>
              <span>Empilhadeiras</span>
            </a>
          </nav>
        </div>
      </div>
    </mat-toolbar>

    <mat-sidenav-container>
      <mat-sidenav #sidenav [mode]="'over'" [fixedInViewport]="true" class="sidenav">
        <mat-nav-list>
          <a mat-list-item routerLink="/home" routerLinkActive="active" (click)="closeSidenavOnMobile()">
            <mat-icon matListItemIcon>home</mat-icon>
            <span>Home</span>
          </a>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active" (click)="closeSidenavOnMobile()">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span>Dashboard</span>
          </a>
          <a mat-list-item routerLink="/employees" routerLinkActive="active" (click)="closeSidenavOnMobile()">
            <mat-icon matListItemIcon>people</mat-icon>
            <span>Funcionários</span>
          </a>
          <a mat-list-item routerLink="/forklifts" routerLinkActive="active" (click)="closeSidenavOnMobile()">
            <mat-icon matListItemIcon>engineering</mat-icon>
            <span>Empilhadeiras</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>
    </mat-sidenav-container>

    <div class="content">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }

    .toolbar-container {
      width: 100%;
    }

    .mobile-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    .desktop-container {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .brand {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: white;
      padding: 8px 0;
    }

    .logo {
      height: 40px;
      width: auto;
      transition: transform 0.2s ease;
      border-radius: 4px;
      background: white;
      padding: 4px;
    }

    .brand:hover .logo {
      transform: scale(1.05);
    }

    .desktop-nav {
      display: flex;
      gap: 8px;
    }

    .desktop-nav a {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .desktop-nav .active {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .sidenav {
      width: 250px;
    }

    .content {
      margin-top: 64px;
    }

    @media (max-width: 768px) {
      .logo {
        height: 32px;
      }

      .content {
        margin-top: 56px;
      }
    }

    :host ::ng-deep .mat-drawer-container {
      background-color: transparent;
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      pointer-events: none;
    }

    :host ::ng-deep .mat-drawer {
      pointer-events: auto;
    }

    :host ::ng-deep .mat-drawer-content {
      pointer-events: none;
    }
  `]
})
export class HeaderComponent implements OnDestroy {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isMobile = false;
  private destroy$ = new Subject<void>();

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.isMobile = result.matches;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  closeSidenavOnMobile() {
    this.sidenav.close();
  }
}