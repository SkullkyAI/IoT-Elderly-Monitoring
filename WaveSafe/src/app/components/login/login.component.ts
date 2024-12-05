import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestAPIService } from '../../services/restAPI.service';

@Component({
    selector: 'WaveLife-login',
    imports: [
        CommonModule,
        ReactiveFormsModule,
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  name = input<string>();
  logo = input<string>();
  loginForm: FormGroup;
  private router = inject(Router);
  private RestService = inject(RestAPIService);
  private fb = inject(FormBuilder);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async submit(event: Event) {
    event.preventDefault();
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      if (await this.RestService.getAuthenticated(email, password))
        this.router.navigate(['/home']);
    }
  }
}
