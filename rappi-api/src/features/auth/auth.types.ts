export interface User {
  id: string;
  email: string;
  name: string | null;
  password: string;
  role: UserRole;
}

export enum UserRole {
  CONSUMER = 'consumer',
  STORE = 'store',
  DELIVERY = 'delivery',
}

export interface CreateUserDTO {
  email: string;
  name?: string | null;
  password: string;
  role: UserRole;
  storeName?: string;
}

export interface UpdateUserDTO {
  id: string;
  name?: string | null;
}

export interface AuthenticateUserDTO {
  email: string;
  password: string;
}
