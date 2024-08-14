import { Component } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  email!: string;
  password!: string;

  constructor(private authService: AuthService, private router: Router) { }

  signIn() {
    this.authService.signIn(this.email, this.password).then(() => {
      // Handle successful signin, navigate to user page, etc.
      this.router.navigate(['/products']);
    }).catch(error => {
      console.error('Error signing in: ', error);
    });
  }
}
