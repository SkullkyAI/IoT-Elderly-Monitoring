import { User } from "./data.interface.ts";

export interface SurrealConfig {
  url: string;
  port: number;
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
