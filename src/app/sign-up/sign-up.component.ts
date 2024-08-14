import { Component } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  email!: string;
  password!: string;
  firstName!: string;
  lastName!: string;

  constructor(private authService: AuthService, private router: Router) { }

  signUp() {
    this.authService.signUp(this.email, this.password, this.firstName, this.lastName).then(() => {
      // Handle successful signup, navigate to user page, etc.
      this.router.navigate(['/products']);
    }).catch(error => {
      console.error('Error signing up: ', error);
    });
  }
}
