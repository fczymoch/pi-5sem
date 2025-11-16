export interface Forklift {
  id: number;
  model: string;
  serialNumber: string;
  manufacturer: string;
  capacity: number;
  lastMaintenanceDate: Date;
  nextMaintenanceDate: Date;
  status: 'available' | 'inUse' | 'maintenance';
  location: string;
  assignedTo?: number;
}
