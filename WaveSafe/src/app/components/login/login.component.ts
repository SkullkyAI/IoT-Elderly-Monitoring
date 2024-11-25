import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'WaveLife-login',
    imports: [
        CommonModule,
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  name = input();
  logo = input();
  private router = inject(Router);


  submit(event: Event) {
    event.preventDefault();
    localStorage.setItem('token', '123456789');
    this.router.navigate(['/home']);
  }
}
