import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'notification-alert',
  imports: [],
  templateUrl: './notification-alert.component.html',
  styleUrl: './notification-alert.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationAlertComponent {
  alertList = input<Array<number | string>>([]);
  alert = input<number | string>(0);
}
