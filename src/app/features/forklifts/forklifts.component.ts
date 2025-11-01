import { Component, OnInit, HostListener } from '@angular/core';
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
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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

      <div class="data-grid-header">
        <div class="filter-section">
          <mat-form-field appearance="outline">
            <mat-label>Pesquisar</mat-label>
            <input matInput [formControl]="searchControl" placeholder="Modelo, Número de Série...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>

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

        <div class="view-toggle">
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

      <ng-container *ngIf="viewMode === 'grid'">
        <app-data-grid
          [data]="filteredForklifts"
          [columns]="columns"
          (onView)="viewForklift($event)"
          (onEdit)="editForklift($event)"
          (onDelete)="deleteForklift($event)">
        </app-data-grid>
      </ng-container>

      <div *ngIf="viewMode === 'cards'" class="cards-container">
        <app-data-card
          *ngFor="let forklift of filteredForklifts"
          [data]="forklift"
          [fields]="cardFields"
          titleField="model"
          subtitleField="serialNumber"
          icon="engineering"
          (onView)="viewForklift($event)"
          (onEdit)="editForklift($event)"
          (onDelete)="deleteForklift($event)">
        </app-data-card>
      </div>
    </div>
  `,
  styles: [`
    .forklifts-container {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    mat-toolbar {
      margin-bottom: 20px;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .cards-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
      padding: 16px;
    }

    @media (max-width: 768px) {
      .cards-container {
        grid-template-columns: 1fr;
      }

      .add-button {
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
export class ForkliftsComponent implements OnInit {
  forklifts: Forklift[] = [];
  filteredForklifts: Forklift[] = [];
  viewMode: 'grid' | 'cards' = 'grid';
  
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
    private router: Router
  ) {}

  ngOnInit() {
    this.loadForklifts();
    this.setupFilters();
    this.setInitialViewMode();
  }

  setInitialViewMode() {
    this.viewMode = window.innerWidth <= 768 ? 'cards' : 'grid';
  }

  loadForklifts() {
    this.forkliftService.getForklifts().subscribe(forklifts => {
      this.forklifts = forklifts;
      this.filteredForklifts = forklifts;
      this.manufacturers = [...new Set(forklifts.map(f => f.manufacturer))];
      this.applyFilters();
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
}