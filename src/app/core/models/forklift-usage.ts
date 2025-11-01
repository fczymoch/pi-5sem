export interface ForkliftUsage {
  id: number;
  employeeId: number;
  forkliftId: number;
  startTime: Date;
  endTime?: Date;
  employee?: {
    id: number;
    name: string;
    position: string;
  };
  forklift?: {
    id: number;
    model: string;
    serialNumber: string;
  };
}