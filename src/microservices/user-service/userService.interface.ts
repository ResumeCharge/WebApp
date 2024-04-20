export interface User {
  userId: string;
  email: string;
  isEmailVerified: boolean;
  isActive: boolean;
  lastUpdatedAt: number;
  createdAt: number;
}

export interface NewUserRequest {
  userId: string;
  email: string;
}
