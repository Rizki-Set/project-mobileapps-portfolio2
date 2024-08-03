import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  masuk() {
    if (this.email && this.password) {
      this.authService.login(this.email, this.password).then(() => {
        this.router.navigate(['home']);
      }).catch((error) => {
        console.error('login failed', error);
      });
    } else {
      console.error('Email and password must be provided');
    }
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {
  }

}

