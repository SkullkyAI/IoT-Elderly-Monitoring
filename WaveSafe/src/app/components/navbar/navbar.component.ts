import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'navbar',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  alertList: Array<number | string> = [1, 2, 3, 4, 5];
  alert = signal<number|string>(0);

  constructor() {
    console.log(this.alertList.length);
    this.alert.set(this.alertList.length);
  }

  signOut(): void {
    // sign out logic
    console.log('Signing out...');
    // clear local storage or session storage
    localStorage.removeItem('token');
  }
 }
