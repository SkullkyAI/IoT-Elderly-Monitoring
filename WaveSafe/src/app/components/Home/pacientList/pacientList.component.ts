import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Pacient } from '../../../interfaces/data.interface';
import { PacientCardComponent } from "../pacientCard/pacientCard.component";


@Component({
  selector: 'pacient-list',
  imports: [PacientCardComponent],
  templateUrl: './pacientList.component.html',
  styleUrl: './pacientList.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PacientListComponent {
  /*
  Para la paginacion me gustaria hacer una funcion que distribuyera los pacientes en las diferentes paginas haciendo
  un array de arrays en el que cada array sea una pagina
  */
  currentPage = signal<number>(1);
  pacientList = signal<Array<Array<Pacient>>> ( [[
    {
      id: '1',
      image: '../../../../public/imagenes_provisional/CarlosGarcía.webp',
      dni: '41234567A',
      name: 'Carlos',
      surname: 'García',
      age: 82,
      medical_summary: 'High blood pressure',
      additional_medical_details: 'Patient requires regular monitoring of blood pressure and medication',
      floor: 3,
      room: 101
    },
    {
      id: '2',
      image: '../../../../public/imagenes_provisional/MaríaFernández.webp',
      dni: '52345678B',
      name: 'María',
      surname: 'Fernández',
      age: 90,
      medical_summary: 'Type 2 diabetes',
      additional_medical_details: 'Patient requires regular monitoring of blood sugar levels and insulin injections',
      floor: 2,
      room: 202
    },
    {
      id: '3',
      image: '../../../../public/imagenes_provisional/JoséLópez.webp',
      dni: '63456789C',
      name: 'José',
      surname: 'López',
      age: 77,
      medical_summary: 'Arthritis in knees',
      additional_medical_details: 'Patient requires regular pain management and physiotherapy',
      floor: 3,
      room: 33
    },
    {
      id: '4',
      image: 'https://wave-safe.s3.eu-west-1.amazonaws.com/fotos_pacientes_IA/AnaMart%C3%ADnez.webp',
      dni: '74567890D',
      name: 'Ana',
      surname: 'Martínez',
      age: 85,
      medical_summary: 'Early-stage Alzheimer’s',
      additional_medical_details: 'Patient is experiencing severe memory loss and cognitive decline',
      floor: 2,
      room: 45
    },
    {
      id: '5',
      image: '../../../../public/imagenes_provisional/LuisSánchez.webp',
      dni: '85678901E',
      name: 'Luis',
      surname: 'Sánchez',
      age: 79,
      medical_summary: 'Chronic back pain',
      additional_medical_details: 'Patient requires regular physiotherapy and pain management',
      floor: 1,
      room: 101
    },
    {
      id: '6',
      image: '../../../../public/imagenes_provisional/LauraGonzález.webp',
      dni: '96789012F',
      name: 'Laura',
      surname: 'González',
      age: 93,
      medical_summary: 'History of heart disease',
      additional_medical_details: 'Patient requires comprehensive care due to advanced heart disease; needs regular monitoring and assistance with daily activities',
      floor: 2,
      room: 88
    },
    {
      id: '7',
      image: '',
      dni: '07890123G',
      name: 'Pedro',
      surname: 'Ramírez',
      age: 88,
      medical_summary: 'Chronic obstructive pulmonary disease (COPD)',
      additional_medical_details: 'Patient requires oxygen therapy and regular check-ups',
      floor: 1,
      room: 102
    },
    {
      id: '8',
      image: '',
      dni: '18901234H',
      name: 'Lucía',
      surname: 'Hernández',
      age: 81,
      medical_summary: 'Osteoporosis',
      additional_medical_details: 'Patient requires calcium supplements and regular bone density tests',
      floor: 2,
      room: 203
    },
    {
      id: '9',
      image: '',
      dni: '29012345I',
      name: 'Miguel',
      surname: 'Torres',
      age: 76,
      medical_summary: 'Parkinson��s disease',
      additional_medical_details: 'Patient requires medication and physical therapy to manage symptoms',
      floor: 3,
      room: 34
    },
    {
      id: '10',
      image: '',
      dni: '30123456J',
      name: 'Isabel',
      surname: 'Ruiz',
      age: 84,
      medical_summary: 'Chronic kidney disease',
      additional_medical_details: 'Patient requires dialysis and regular monitoring of kidney function',
      floor: 1,
      room: 103
    },
    {
      id: '11',
      image: '',
      dni: '41234567K',
      name: 'Antonio',
      surname: 'Gómez',
      age: 87,
      medical_summary: 'Congestive heart failure',
      additional_medical_details: 'Patient requires medication and regular monitoring of heart function',
      floor: 2,
      room: 204
    },
    {
      id: '12',
      image: '',
      dni: '52345678L',
      name: 'Carmen',
      surname: 'Díaz',
      age: 79,
      medical_summary: 'Severe asthma',
      additional_medical_details: 'Patient requires inhalers and regular check-ups to manage asthma',
      floor: 3,
      room: 35
    }],
    [
    {
      id: '13',
      image: '',
      dni: '63456789M',
      name: 'Javier',
      surname: 'Martín',
      age: 82,
      medical_summary: 'Prostate cancer',
      additional_medical_details: 'Patient requires regular monitoring and treatment for prostate cancer',
      floor: 1,
      room: 104
    }

  ]]);

  protected MaxPageExistence(): number{
    return Math.ceil(this.pacientList().length / 12) + 1;
  }

  protected nextPage(): void {
    if (this.currentPage() < this.MaxPageExistence()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  protected previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  protected goToPage(page: number): void {
    if (page >= 1 && page <= this.MaxPageExistence()) {
      this.currentPage.set(page);
    }
  }
}
