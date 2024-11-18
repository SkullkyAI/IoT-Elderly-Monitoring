import { User } from "./data.interface";

export interface SurrealConfig {
  url: string;
  namespace: string;
  database: string;
  username: string;
  password: string;
}
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
