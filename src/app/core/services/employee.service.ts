import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Employee } from '../models/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private mockEmployees: Employee[] = [
    {
      id: 1,
      name: 'John Doe',
      position: 'Forklift Operator',
      department: 'Logistics',
      email: 'john.doe@company.com',
      phone: '(11) 99999-9999',
      hiringDate: new Date('2022-01-15'),
      status: 'active',
      certifications: ['Forklift Operation', 'Safety Training'],
      lastTrainingDate: new Date('2023-06-20')
    },
    // Add more mock data here
  ];

  getEmployees(): Observable<Employee[]> {
    return of(this.mockEmployees);
  }

  getEmployee(id: number): Observable<Employee | undefined> {
    return of(this.mockEmployees.find(emp => emp.id === id));
  }

  createEmployee(employee: Employee): Observable<Employee> {
    const newEmployee = { ...employee, id: this.mockEmployees.length + 1 };
    this.mockEmployees.push(newEmployee);
    return of(newEmployee);
  }

  updateEmployee(employee: Employee): Observable<Employee> {
    const index = this.mockEmployees.findIndex(emp => emp.id === employee.id);
    if (index !== -1) {
      this.mockEmployees[index] = employee;
    }
    return of(employee);
  }

  deleteEmployee(id: number): Observable<boolean> {
    const index = this.mockEmployees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      this.mockEmployees.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}