export interface ActivityLog {
  id: number;
  operationType: string;
  entity: string;
  description: string;
  timestamp: Date;
  details: string;
  icon: string;
  color: string;
}