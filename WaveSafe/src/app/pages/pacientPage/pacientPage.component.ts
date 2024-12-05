import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { PacientAnalysisComponent } from '../../components/pacientAnalysis/pacientAnalysis.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { RestAPIService } from '../../services/restAPI.service';
import { ActivatedRoute } from '@angular/router';
import { PacientAInfo } from '../../interfaces/data.interface';

@Component({
    imports: [
        CommonModule,
        PacientAnalysisComponent,
        NavbarComponent
    ],
    template: `
      <navbar />
      <div class="pacienProfile">
        <img src="http://placehold.it/1000x300" alt="imagen" />
        <div class="pacientDetails">
          <h1>Nombre del paciente</h1>
          <p>Edad: 20</p>
          <p>Sexo: Hombre</p>
          <p>Fecha de nacimiento: 01/01/2000</p>
          <p>Diagnóstico: Parkinson</p>
          <p>Fecha de diagnóstico: 01/01/2020</p>
          <p>Medicación: Levodopa</p>
       </div>
      </div>
      <div>
        <h1>Estadísticas</h1>
      </div>
      <pacient-analysis [data]="undefined" [data_bars]="undefined" [dates]="undefined" />
    `,
    styleUrl: './pacientPage.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PacientPageComponent implements OnInit {
  private readonly _restApi = inject(RestAPIService);
  private readonly _route = inject(ActivatedRoute);

  private pacientId: string = '';
  profile_info = signal<PacientAInfo | null>(null);

  async ngOnInit() {
    this._route.params.subscribe(params => this.pacientId = params['id']);
    this.profile_info.set(await this._restApi.getPacientInfo(this.pacientId));


    console.log(this.profile_info());
  }
}

