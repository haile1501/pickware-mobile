export interface Employee {
  _id: string;
  shortId: string;
  image: string;
  fullName: string;
  address: string;
  phone: string;
  status: EmployeeStatus;
  workload: number;
  role: 'picker' | 'manager';
  username: string;
}

export enum EmployeeStatus {
  PICKING = 'picking',
  AVAILABLE = 'available',
  NOT_AVAILABLE = 'not available',
}

export interface EmployeeState {
  employees: Employee[];
  employeeDetail: Employee | null;
  loading: boolean;
  errorMessage: string;
  paginationData: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
