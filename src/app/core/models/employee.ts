export interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  hiringDate: Date;
  status: 'active' | 'inactive';
  certifications: string[];
  lastTrainingDate: Date;
  /** Lista de cursos do funcionário (opcional) */
  courses?: string[];
}
