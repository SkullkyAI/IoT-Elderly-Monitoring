import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { Base64ImagePipe } from '../../pipes/imageTransform.pipe';
import { SearchBarComponent } from '../../components/Home/searchBar/searchBar.component';
import { PacientListComponent } from '../../components/Home/pacientList/pacientList.component';

@Component({
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
 }
