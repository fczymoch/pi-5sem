export interface Forklift {
  id: number;
  model: string;
  serialNumber: string;
  manufacturer: string;
  capacity: number;
  lastMaintenanceDate: Date;
  nextMaintenanceDate: Date;
  status: 'available' | 'in-use' | 'maintenance';
  location: string;
  assignedTo?: number;
  isInactive: boolean;
}
