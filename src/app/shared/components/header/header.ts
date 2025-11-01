import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

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
    MatListModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav mode="over" class="sidenav">
        <mat-nav-list>
          <a mat-list-item routerLink="/home" (click)="sidenav.close()">
            <mat-icon matListItemIcon>home</mat-icon>
            <span matListItemTitle>Home</span>
          </a>
          <a mat-list-item routerLink="/employees" (click)="sidenav.close()">
            <mat-icon matListItemIcon>people</mat-icon>
            <span matListItemTitle>Funcionários</span>
          </a>
          <a mat-list-item routerLink="/forklifts" (click)="sidenav.close()">
            <mat-icon matListItemIcon>engineering</mat-icon>
            <span matListItemTitle>Empilhadeiras</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar color="primary" class="header">
          <div class="mobile-container">
            <button mat-icon-button class="menu-button" (click)="sidenav.toggle()">
              <mat-icon>menu</mat-icon>
            </button>
            
            <a mat-button routerLink="/" class="brand">
              <span>Sistema de Gestão de Empilhadeiras</span>
            </a>
          </div>

          <span class="spacer"></span>

          <nav class="desktop-nav">
            <a mat-button routerLink="/home" routerLinkActive="active">
              <mat-icon>home</mat-icon>
              <span>Home</span>
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
        </mat-toolbar>
        <ng-content></ng-content>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
    }

    .mobile-container {
      display: flex;
      align-items: center;
      width: 100%;
    }

    .menu-button {
      order: 1;
    }

    .brand {
      text-decoration: none;
      color: white;
      margin-left: 8px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      order: 2;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .desktop-nav {
      display: flex;
      gap: 8px;

      a {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .active {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }

    @media (max-width: 768px) {
      .desktop-nav {
        display: none;
      }

      .brand span {
        font-size: 16px;
      }

      .mobile-container {
        flex-direction: row-reverse;
        justify-content: space-between;
      }

      .menu-button {
        margin-right: 0;
      }

      .brand {
        margin-left: 0;
        margin-right: 8px;
        flex: 1;
        text-align: right;
      }
    }

    @media (min-width: 769px) {
      .menu-button {
        display: none;
      }

      .mobile-container {
        flex: 1;
      }
    }
  `]
})
export class Header implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        if (!result.matches) {
          this.sidenav.close();
        }
      });
  }
}
