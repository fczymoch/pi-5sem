import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./features/home/landing.component').then(m => m.LandingComponent) },
  { path: 'dashboard', loadComponent: () => import('./features/home/home').then(m => m.HomeComponent) },
  { path: 'employees', loadComponent: () => import('./features/employees/employees.component').then(m => m.EmployeesComponent) },
  { path: 'employees/new', loadComponent: () => import('./features/employees/employee-form/employee-form.component').then(m => m.EmployeeFormComponent) },
  { path: 'employees/:id', loadComponent: () => import('./features/employees/employee-detail/employee-detail.component').then(m => m.EmployeeDetailComponent) },
  { path: 'employees/:id/edit', loadComponent: () => import('./features/employees/employee-form/employee-form.component').then(m => m.EmployeeFormComponent) },
  { path: 'forklifts', loadComponent: () => import('./features/forklifts/forklifts.component').then(m => m.ForkliftsComponent) },
  { path: 'forklifts/new', loadComponent: () => import('./features/forklifts/forklift-form/forklift-form.component').then(m => m.ForkliftFormComponent) },
  { path: 'forklifts/:id', loadComponent: () => import('./features/forklifts/forklift-detail/forklift-detail.component').then(m => m.ForkliftDetailComponent) },
  { path: 'forklifts/:id/edit', loadComponent: () => import('./features/forklifts/forklift-form/forklift-form.component').then(m => m.ForkliftFormComponent) },
];
