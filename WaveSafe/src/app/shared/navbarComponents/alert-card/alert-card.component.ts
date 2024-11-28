import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'alert-card',
  imports: [],
  templateUrl: './alert-card.component.html',
  styleUrl: './alert-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertCardComponent { }
