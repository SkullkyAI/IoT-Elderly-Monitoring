import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { PacientAnalysisComponent } from '../../components/pacientAnalysis/pacientAnalysis.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { RestAPIService } from '../../services/restAPI.service';
import { ActivatedRoute } from '@angular/router';
import { PacientAInfo } from '../../interfaces/data.interface';
import { Data } from 'plotly.js';

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
          <h1>{{profile_info()!.name}} {{profile_info()!.surname}}</h1>
          <p>Edad: {{profile_info()!.age}}</p>
          <p>Sexo: Hombre</p>
          <p>Fecha de nacimiento: 01/01/2000</p>
          <p>Diagnóstico: {{profile_info()!.medical_summary}}</p>
          <p>Fecha de diagnóstico: 01/01/2020</p>
          <p>Medicación: {{profile_info()!.additional_medical_details}}</p>
       </div>
      </div>
      <div style="padding-left: 30px">
        <h1>Estadísticas</h1>
      </div>
      <pacient-analysis [lineData]="lineData" [data_bars]="data_bars" [dates]="date"/>
    `,
    styleUrl: './pacientPage.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PacientPageComponent implements OnInit {
  private readonly _restApi = inject(RestAPIService);
  private readonly _route = inject(ActivatedRoute);

  private pacientId: string = '';
  profile_info = signal<PacientAInfo | null>(null);
  public date: Array<Date> = [];
  public data_bars: Array<boolean> = [];
  public lineData: Array<number> = [];

  async ngOnInit() {
    this._route.params.subscribe(params => this.pacientId = params['id']);
    this.profile_info.set(await this._restApi.getPacientInfo(this.pacientId));

    this.date = this.profile_info()!.data.map(item => item.date);
    this.data_bars = this.profile_info()!.data.map(item => item.falling);
    this.lineData = this.profile_info()!.data.map(item => item.movement);
    console.log(this.date);
  }
}

