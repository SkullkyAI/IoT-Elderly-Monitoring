import { User, Position } from "./data.interface.ts";

export interface SurrealConfig {
  url: string;
  port: number;
  namespace: string;
  database: string;
  username: string;
  password: string;
}
export interface AuthCredentials {
  id:string;
  user: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface SurrealUser{
  name: string;
  surname: string;
  email: string;
  position: Position;
  passwd: string;
}
