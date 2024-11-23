import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Pacient } from '../../interfaces/data.interface';
import { PacientCardComponent } from "../pacientCard/pacientCard.component";


@Component({
  selector: 'pacient-list',
  imports: [PacientCardComponent],
  templateUrl: './pacientList.component.html',
  styleUrl: './pacientList.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PacientListComponent {
  pacientList: Array<Pacient> = [
    {
      id: '1',
      image: '',
      dni: '123456789K',
      name: 'John',
      surname: 'Doe',
      age: 35,
      medical_score: 95,
      floor: 3,
      room: 101
    },
    {
      id: '2',
      image: '',
      dni: '987654321P',
      name: 'Jane',
      surname: 'Smith',
      age: 40,
      medical_score: 80,
      floor: 2,
      room: 202
    }
  ];
}
