import { ChangeDetectionStrategy, Component, computed, signal, OnDestroy, inject, resource } from '@angular/core';
import { AlertCardComponent } from '../alert-card/alert-card.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment/environment';
import { alerts } from '../../../interfaces/alets.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'notification-alert',
  imports: [AlertCardComponent, CommonModule, AlertCardComponent],
  templateUrl: './notification-alert.component.html',
  styleUrl: './notification-alert.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationAlertComponent implements OnDestroy {
  private intervalId: any;
  private http = inject(HttpClient);
  alertList = signal<Array<alerts>>([]);
  alert = computed<number>(() => this.alertList().length);
  private _alerts = resource<Array<alerts>, unknown>({loader: async() => {
    try {
      const response = await (await fetch(`${environment.api_url}/notifications`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
      credentials: 'include'
      })).json();
      console.log("response",response);
      return response;

    } catch (error) {
      throw error;
    }
  }});


  constructor() {
    this.intervalId = setInterval(() => {
      this.checkForNewAlerts();
      console.log("List of alerts",this.alertList());
    }, 5000);
    console.log("number alerts",this.alert());
  }

  private checkForNewAlerts() {
    this._alerts.reload();
    const newAlerts = this._alerts.value || [];
    console.log("new alerts",newAlerts());

    if (Array.isArray(newAlerts())) {
      this.alertList.set([...this.alertList(), ...(newAlerts() || [])]);
    }
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
