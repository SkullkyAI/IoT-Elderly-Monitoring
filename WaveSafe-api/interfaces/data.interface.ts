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
  medical_score: number;
  floor: number;
  room: number;
  [key: string]: unknown;
}

export interface MqttData{
  idPacient: string;
  isFallen: boolean;
  time_movement: number;
}

export interface Notifications{
  namePacient: string;
  floor: number;
  room: number;
}
