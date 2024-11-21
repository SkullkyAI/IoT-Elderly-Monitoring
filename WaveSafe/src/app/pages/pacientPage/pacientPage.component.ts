import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-pacient-page',
    imports: [
        CommonModule,
    ],
    templateUrl: './pacientPage.component.html',
    styleUrl: './pacientPage.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PacientPageComponent { }
