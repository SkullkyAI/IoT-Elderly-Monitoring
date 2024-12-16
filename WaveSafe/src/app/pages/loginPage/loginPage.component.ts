import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoginComponent } from '../../components/login/login.component';

@Component({
    imports: [
        CommonModule,
        LoginComponent
    ],
    template: `<WaveLife-login id="login"[name]="title" [logo]="logo" />`,
    styleUrl: './loginPage.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {
  title:string = "WaveLife";
  logo: string = 'favicon.ico';
}
