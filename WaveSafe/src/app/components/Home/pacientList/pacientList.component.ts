import { ChangeDetectionStrategy, Component, signal, inject, OnInit } from '@angular/core';
import { Pacient } from '../../../interfaces/data.interface';
import { PacientCardComponent } from "../pacientCard/pacientCard.component";
import { RestAPIService } from '../../../services/restAPI.service';


@Component({
  selector: 'pacient-list',
  imports: [PacientCardComponent],
  templateUrl: './pacientList.component.html',
  styleUrl: './pacientList.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PacientListComponent implements OnInit {
  /*
  Para la paginacion me gustaria hacer una funcion que distribuyera los pacientes en las diferentes paginas haciendo
  un array de arrays en el que cada array sea una pagina
  */
  private RestS = inject(RestAPIService);
  currentPage = signal<number>(1);
  maxPages:number = 0;
  paginationPages:Array<number> = [];
  pacientList = signal<Array<Array<Pacient>>>([]);

  async ngOnInit() {
    await this.Paginacion();
    console.log(this.pacientList());
  }
  private transformPacientData(rawData: any): Pacient {
    return {
      id: rawData.id.split(':')[1], // Extraemos solo el número después de "pacient:"
      image: rawData.image,
      dni: rawData.dni,
      name: rawData.name,
      surname: rawData.surname,
      age: rawData.age,
      medical_summary: rawData.medical_summary,
      additional_medical_details: rawData.additional_medical_details,
      floor: rawData.floor[0]?.floor || 0,
      room: rawData.room[0]?.room || 0
    };
  }

  private async Paginacion(){
    let PacientRest: Array<Pacient> = [];
    await this.RestS.getPacientList().then((response) => {
      PacientRest = response.map((item: any) => this.transformPacientData(item));
    });

    const maxLength = 12;
    const pages: Array<Array<Pacient>> = [];
    for (let i =0; i < PacientRest.length; i += maxLength) {
      pages.push(PacientRest.slice(i, i+maxLength));
    }

    this.paginationPages = Array.from({length: pages.length}, (_, index) => index + 1);
    this.maxPages = pages.length;
    this.pacientList.set(pages);
  }


  protected nextPage(): void {
    if (this.currentPage() < this.maxPages) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  protected previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  protected goToPage(page: number): void {
    if (page >= 1 && page <= this.maxPages) {
      this.currentPage.set(page);
    }
  }

}
