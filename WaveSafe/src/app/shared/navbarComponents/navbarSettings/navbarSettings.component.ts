import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'navbar-settings',
  imports: [],
  templateUrl: './navbarSettings.component.html',
  styleUrl: './navbarSettings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarSettingsComponent {
  signOut(): void {
    // sign out logic
    console.log('Signing out...');
    // clear local storage or session storage
    localStorage.removeItem('token');
  }
}
