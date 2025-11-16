import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { DataGridComponent } from '../../shared/components/data-grid/data-grid.component';
import { DataCardComponent } from '../../shared/components/data-card/data-card.component';
import { ForkliftService } from '../../core/services/forklift.service';
import { Forklift } from '../../core/models/forklift';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-forklifts',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    DataGridComponent,
    DataCardComponent
  ],
  template: `
    <div class="forklifts-container">
      <mat-toolbar color="primary">
        <span>Gestão de Empilhadeiras</span>
        <span class="spacer"></span>
        <button mat-raised-button color="accent" (click)="addForklift()" class="add-button">
          <mat-icon>add</mat-icon>
          Nova Empilhadeira
        </button>
      </mat-toolbar>

      <div class="controls-container">
        <div class="filters-wrapper">
          <div class="search-section">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Pesquisar</mat-label>
              <input matInput [formControl]="searchControl" placeholder="Modelo, Número de Série...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>

          <div class="filters-section">
            <mat-form-field appearance="outline">
              <mat-label>Status</mat-label>
              <mat-select [formControl]="statusFilter">
                <mat-option value="">Todos</mat-option>
                <mat-option value="available">Disponível</mat-option>
                <mat-option value="in-use">Em Uso</mat-option>
                <mat-option value="maintenance">Manutenção</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Fabricante</mat-label>
              <mat-select [formControl]="manufacturerFilter">
                <mat-option value="">Todos</mat-option>
                <mat-option *ngFor="let manufacturer of manufacturers" [value]="manufacturer">
                  {{manufacturer}}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Capacidade Min. (kg)</mat-label>
              <input matInput type="number" [formControl]="capacityFilter" min="0">
            </mat-form-field>
          </div>
        </div>

        <div class="view-toggle" *ngIf="!isMobile">
          <mat-button-toggle-group
            [value]="viewMode"
            (change)="onViewModeChange($event.value)">
            <mat-button-toggle value="grid">
              <mat-icon>view_list</mat-icon>
            </mat-button-toggle>
            <mat-button-toggle value="cards">
              <mat-icon>view_module</mat-icon>
            </mat-button-toggle>
          </mat-button-toggle-group>
        </div>
      </div>

      <!-- Loading state -->
      <div *ngIf="isLoading" class="loading-message">
        <mat-icon>refresh</mat-icon>
        <p>Carregando empilhadeiras...</p>
      </div>

      <!-- Grid view quando há dados -->
      <ng-container *ngIf="!isLoading && forklifts.length > 0 && viewMode === 'grid'">
        <app-data-grid
          [data]="filteredForklifts"
          [columns]="columns"
          (onView)="viewForklift($event)"
          (onEdit)="editForklift($event)"
          (onDelete)="deleteForklift($event)">
        </app-data-grid>
      </ng-container>

      <!-- Cards view quando há dados -->
      <div *ngIf="!isLoading && forklifts.length > 0 && viewMode === 'cards'" class="cards-container">
        <app-data-card
          *ngFor="let forklift of filteredForklifts"
          [data]="forklift"
          [fields]="cardFields"
          titleField="model"
          subtitleField="serialNumber"
          [icon]="getForkliftIcon(forklift)"
          (onView)="viewForklift($event)"
          (onEdit)="editForklift($event)"
          (onDelete)="deleteForklift($event)">
        </app-data-card>
      </div>

      <!-- Mensagem quando não há dados (após carregamento) -->
      <div *ngIf="!isLoading && forklifts.length === 0" class="no-data-message">
        <mat-icon>cloud_off</mat-icon>
        <h3>Nenhuma empilhadeira encontrada</h3>
        <p>Os dados não estão disponíveis. Verifique se o backend está rodando ou se há empilhadeiras cadastradas.</p>
      </div>
    </div>
  `,
  styles: [`
    .forklifts-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 0;
      margin: 0;
    }

    mat-toolbar {
      margin-bottom: 16px;
      flex-shrink: 0;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .controls-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
      background: white;
      margin-bottom: 16px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .filters-wrapper {
      display: flex;
      flex-direction: column;
      gap: 16px;
      width: 100%;
    }

    .search-section {
      width: 100%;
    }

    .search-field {
      width: 100%;
    }

    .filters-section {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
    }

    .view-toggle {
      align-self: flex-end;
    }

    .cards-container {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
      padding: 0 16px 16px;
    }

    @media (min-width: 600px) {
      .controls-container {
        flex-direction: row;
        align-items: flex-end;
        justify-content: space-between;
        padding: 20px;
      }

      .filters-wrapper {
        flex: 1;
        max-width: calc(100% - 200px);
      }

      .filters-section {
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
      }

      .cards-container {
        grid-template-columns: repeat(2, 1fr);
        padding: 0 20px 20px;
      }
    }

    @media (min-width: 900px) {
      .cards-container {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .no-data-message, .loading-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
      color: #666;
    }

    .no-data-message mat-icon, .loading-message mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .loading-message mat-icon {
      animation: spin 2s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (min-width: 1200px) {
      .cards-container {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    @media (max-width: 768px) {
      .add-button span {
        display: none;
      }

      .view-toggle {
        display: none;
      }

      .filter-section {
        flex-direction: column;
        gap: 8px;
        padding: 8px;
      }

      .filter-section mat-form-field {
        min-width: 100%;
      }

      ::ng-deep app-data-grid {
        display: none !important;
      }
    }
  `]
})
export class ForkliftsComponent implements OnInit, OnDestroy {
  forklifts: Forklift[] = [];
  filteredForklifts: Forklift[] = [];
  viewMode: 'grid' | 'cards' = 'grid';
  isMobile = false;
  isLoading: boolean = false;
  private destroy$ = new Subject<void>();
  
  // Form Controls for filters
  searchControl = new FormControl('');
  statusFilter = new FormControl('');
  manufacturerFilter = new FormControl('');
  capacityFilter = new FormControl('');

  // Lista única de fabricantes para o filtro
  manufacturers: string[] = [];

  columns: { key: string; label: string; type?: 'text' | 'status' | 'date' }[] = [
    { key: 'model', label: 'Modelo', type: 'text' },
    { key: 'serialNumber', label: 'Número de Série', type: 'text' },
    { key: 'manufacturer', label: 'Fabricante', type: 'text' },
    { key: 'capacity', label: 'Capacidade (kg)', type: 'text' },
    { key: 'status', label: 'Status', type: 'status' }
  ];

  cardFields: { key: string; label: string; type?: 'text' | 'status' | 'date' }[] = [
    { key: 'model', label: 'Modelo', type: 'text' },
    { key: 'serialNumber', label: 'Número de Série', type: 'text' },
    { key: 'manufacturer', label: 'Fabricante', type: 'text' },
    { key: 'capacity', label: 'Capacidade (kg)', type: 'text' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'location', label: 'Localização', type: 'text' }
  ];

  constructor(
    private forkliftService: ForkliftService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.isMobile = result.matches;
        if (this.isMobile) {
          this.viewMode = 'cards';
        }
      });
  }

  ngOnInit() {
    this.loadForklifts();
    this.setupFilters();
    this.setInitialViewMode();
  }

  setInitialViewMode() {
    this.viewMode = window.innerWidth <= 768 ? 'cards' : 'grid';
  }

  loadForklifts() {
    console.log('🔄 Componente: Iniciando carregamento de empilhadeiras');
    this.isLoading = true;
    this.forkliftService.getAllForklifts().subscribe({
      next: (forklifts: Forklift[]) => {
        console.log('🚚 Componente: Empilhadeiras recebidas do service:', forklifts.length, 'itens', forklifts);
        this.forklifts = forklifts;
        this.filteredForklifts = forklifts;
        this.manufacturers = [...new Set(forklifts.map(f => f.manufacturer))];
        this.applyFilters();
        this.isLoading = false;
        console.log('✅ Componente: Carregamento concluído. Exibindo:', this.filteredForklifts.length, 'empilhadeiras');
      },
      error: (error) => {
        console.error('❌ Componente: Erro ao carregar empilhadeiras:', error);
        this.forklifts = [];
        this.filteredForklifts = [];
        this.manufacturers = [];
        this.isLoading = false;
      }
    });
  }

  setupFilters() {
    // Configurar listeners para os controles de filtro
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => this.applyFilters());

    this.statusFilter.valueChanges.subscribe(() => this.applyFilters());
    this.manufacturerFilter.valueChanges.subscribe(() => this.applyFilters());
    this.capacityFilter.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => this.applyFilters());
  }

  applyFilters() {
    let filtered = [...this.forklifts];

    // Aplicar filtro de pesquisa
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    if (searchTerm) {
      filtered = filtered.filter(f =>
        f.model.toLowerCase().includes(searchTerm) ||
        f.serialNumber.toLowerCase().includes(searchTerm)
      );
    }

    // Aplicar filtro de status
    const status = this.statusFilter.value;
    if (status) {
      filtered = filtered.filter(f => f.status === status);
    }

    // Aplicar filtro de fabricante
    const manufacturer = this.manufacturerFilter.value;
    if (manufacturer) {
      filtered = filtered.filter(f => f.manufacturer === manufacturer);
    }

    // Aplicar filtro de capacidade
    const capacity = Number(this.capacityFilter.value);
    if (!isNaN(capacity) && capacity > 0) {
      filtered = filtered.filter(f => f.capacity >= capacity);
    }

    this.filteredForklifts = filtered;
  }

  addForklift() {
    this.router.navigate(['/forklifts/new']);
  }

  onViewModeChange(mode: 'grid' | 'cards') {
    if (window.innerWidth > 768) {
      this.viewMode = mode;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth <= 768 && this.viewMode === 'grid') {
      this.viewMode = 'cards';
    }
  }

  viewForklift(forklift: Forklift) {
    this.router.navigate(['/forklifts', forklift.id]);
  }

  editForklift(forklift: Forklift) {
    this.router.navigate(['/forklifts', forklift.id, 'edit']);
  }

  deleteForklift(forklift: Forklift) {
    if (confirm('Tem certeza que deseja excluir esta empilhadeira?')) {
      this.forkliftService.deleteForklift(forklift.id).subscribe(() => {
        this.loadForklifts();
      });
    }
  }

  getForkliftIcon(forklift: Forklift): string {
    switch (forklift.status) {
      case 'available':
        return 'engineering'; // Available forklift icon
      case 'inUse':
        return 'local_shipping'; // In-use/active forklift icon
      case 'maintenance':
        return 'build'; // Maintenance/repair icon
      default:
        return 'engineering';
    }
  }
}