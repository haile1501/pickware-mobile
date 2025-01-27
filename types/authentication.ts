export type AuthenticationState = {
  loading: boolean;
  isAuthenticated: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  user: User | null;
};

export type LoginRequestType = {
  username: string;
  password: string;
};

export type User = {
  _id: string;
  fullName: string;
  phone: string;
  isAvailable: boolean;
  workload: number;
  username: string;
};
