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
  medical_summary: string;
  additional_medical_details: string;
  floor: number;
  room: number;
}

export interface PacientAInfo{
  name: string;
  surname: string;
  age: number;
  image:string;
  medical_summary: string;
  additional_medical_details: string;
  data:Data[];
}

export interface Data{
  date: Date;
  falling: boolean;
  movement: number;
}
