import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

enum TypeSearch {
  ByName = 'By Name',
  ByType = 'By Type',
}
@Component({
  selector: 'search-bar',
  imports: [ReactiveFormsModule, CommonModule],
  template: `
  <form class="form" [formGroup]="form" autocomplete ="off" (keyup)="search()">
    <input type="text" placeholder="Que paciente quiere buscar?" formControlName="search" />
    <select formControlName="type_search">
      @for (type of typeSearchValues; track $index) {
        <option>{{type}}</option>
      }
    </select>
  </form>
   `,
  styleUrl: './searchBar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent {

  private _formBuilder = inject(FormBuilder);

  form = this._formBuilder.group({
    search: this._formBuilder.control(''),
    type_search: this._formBuilder.control<TypeSearch>(TypeSearch.ByName),
  });

  typeSearchValues = Object.values(TypeSearch);

  search() {
    console.log(this.form.get('search')?.value);
  }
}
