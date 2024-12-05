export enum Position {
  Nurse,
  Doctor,
  Admin,
  Manager,
  Other,
}
export interface User {
  name: string;
  surname: string;
  email: string;
  position: Position;
}

export interface Pacient {
  id: string;
  name: string;
  surname: string;
  age: number;
  dni:string;
  medical_score: number;
  additional_medical_details:string;
  floor: number;
  room: number;
}

export interface MqttData{
  idPacient: string;
  isFallen: boolean;
  time_movement: number;
}

export interface Notifications{
  id: string;
  namePacient: string;
  floor: number;
  room: number;
}
export interface AuthCredentialsSys {
  username: string;
  password: string;
}
