export interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  hiringDate: Date;
  status: 'active' | 'inactive';
  lastTrainingDate: Date;
  courses: string[];
}
