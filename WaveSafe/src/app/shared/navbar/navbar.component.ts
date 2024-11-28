import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {NotificationAlertComponent} from '../navbarComponents/notification-alert/notification-alert.component';
import {NavbarSettingsComponent} from '../navbarComponents/navbarSettings/navbarSettings.component';

@Component({
    selector: 'navbar',
    imports: [
    CommonModule,
    NotificationAlertComponent,
    NavbarSettingsComponent
],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  alertList = signal<Array<number>>([]);
  constructor() {
    console.log(this.alertList());
  }


 }
