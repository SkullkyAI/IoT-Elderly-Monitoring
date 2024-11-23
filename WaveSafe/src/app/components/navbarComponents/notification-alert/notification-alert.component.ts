import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AlertCardComponent } from '../alert-card/alert-card.component';

@Component({
  selector: 'notification-alert',
  imports: [AlertCardComponent],
  templateUrl: './notification-alert.component.html',
  styleUrl: './notification-alert.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationAlertComponent {
  alertList = input<Array<number>>([]);
   alert = computed<number>(() => this.alertList().length);
  constructor() {
    console.log(this.alert());
    console.log(this.alertList());
  }
}
