// API Response interfaces based on backend DTOs
export interface ApiPageableResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  empty: boolean;
}

export interface ApiForkliftResponse {
  id: number;
  descricao: string;
  status: number;
  flagUso: number;
}

export interface ApiActivityLogResponse {
  id: number;
  tipoOperacao: string;
  entidade: string;
  descricao: string;
  dataHora: string; // ISO date string
  detalhes: string;
}

export interface ApiForkliftUsageResponse {
  id: number;
  idFuncionario: number;
  idEmpilhadeira: number;
  dataInicio: string; // ISO date string
  dataFim: string | null; // ISO date string
  status: number; // 1=ACTIVE, 0=INACTIVE
}

export interface ApiForkliftUsageHistoryResponse {
  idUso: number;
  idFuncionario: number;
  nomeFuncionario: string;
  cargoFuncionario: number;
  dataInicio: string; // ISO date string
  dataFim: string | null; // ISO date string
  status: number;
  duracaoHoras: number;
}

export interface ApiForkliftRequest {
  model: string;
  serialNumber: string;
  manufacturer: string;
  capacity: number;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  location: string;
}

export interface ApiEmployeeResponse {
  id: number;
  nome: string;
  cargo: number;
  status: number;
}

export interface ApiEmployeeRequest {
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  hiringDate: string;
  certifications: string[];
  courses: string[];
}

export interface ApiDashboardResponse {
  forkliftStatus: {
    available: number;
    inUse: number;
    maintenance: number;
  };
  employeeCertifications: {
    valid: number;
    expiring: number;
    expired: number;
  };
  stats: {
    totalForklifts: number;
    totalEmployees: number;
    activeEmployees: number;
    activeUsages: number;
  };
}