import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Base64ImagePipe } from '../../pipes/imageTransform.pipe';
import { SearchBarComponent } from '../../components/searchBar/searchBar.component';
import { PacientListComponent } from '../../components/pacientList/pacientList.component';

@Component({
    selector: 'app-home-page',
    imports: [
    CommonModule,
    NavbarComponent,
    // Base64ImagePipe,
    SearchBarComponent,
    PacientListComponent
],
    templateUrl: './homePage.component.html',
    styleUrl: './homePage.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
  image:string = "";
 }
