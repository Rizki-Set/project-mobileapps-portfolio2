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
    public router: Router,
    public auth: AuthService
  ) { }

  masuk() {
    this.auth.login(this.email, this.password).then(user => {
      const uid = user.user?.uid;
      if (uid) {
        // Menggunakan observer untuk subscribe
        const observer = {
          next: (res: any) => {
            if (res.role === 'admin') {
              this.router.navigate(['home']);
            } else {
              this.auth.toast('Akun Ini Tidak Memiliki Akses');
              this.email = '';
              this.password = '';
              this.auth.logout();
            }
          },
          error: (error: any) => {
            this.auth.toast('Gagal mengambil data pengguna.');
            console.error('Error fetching user data: ', error);
          },
          complete: () => {
            console.log('User data fetching completed');
          }
        };
        this.auth.user(uid).subscribe(observer);
      } else {
        this.auth.toast('Login gagal. User ID tidak ditemukan.');
        this.email = '';
        this.password = '';
        this.auth.logout();
      }
    }).catch(async (err: any) => {
      this.email = '';
      this.password = '';
      if (err.code === 'auth/invalid-email') {
        await this.auth.toast('Format Email Salah');
      } else if (err.code === 'auth/user-not-found') {
        await this.auth.toast('Akun Tidak Ditemukan');
      } else if (err.code === 'auth/wrong-password') {
        await this.auth.toast('Kata Sandi Salah');
      } else {
        await this.auth.toast('Login gagal. Silakan coba lagi.');
      }
      console.log(err.code);
    });
  }

  ngOnInit() {
    console.log('LoginPage initialized');
  }

}
