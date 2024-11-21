import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
    selector: 'app-home-page',
    imports: [
        CommonModule,
        NavbarComponent
    ],
    templateUrl: './homePage.component.html',
    styleUrl: './homePage.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent { }
