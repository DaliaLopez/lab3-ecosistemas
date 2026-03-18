export const UserRole = {
  CONSUMER: 'consumer',
  STORE: 'store',
  DELIVERY: 'delivery',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface User {
  id: string;
  email: string;
  name: string | null;
  password: string;
  role: UserRole;
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
