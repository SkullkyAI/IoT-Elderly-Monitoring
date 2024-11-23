enum Position {Nurse, Doctor, Admin, Manager, Other};
export interface User{
  name: string;
  surname: string;
  email: string;
  position: Position;
}

export interface Pacient{
  id: string;
  image: string;
  dni: string;
  name: string;
  surname: string;
  age: number;
  medical_score: number;
  floor: number;
  room: number;
}
