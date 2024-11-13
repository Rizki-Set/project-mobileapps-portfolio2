import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Mengimpor layanan autentikasi

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  nama: string = '';
   selectedRole: string = 'customer';
  isRegistering: boolean = false;

  constructor(
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit() {
    console.log('LoginPage initialized');
  }

  async masuk() {
    console.log('Attempting to login with email:', this.email);
    try {
      const userCredential = await this.auth.signInWithEmailAndPassword(this.email, this.password);
      const uid = userCredential.user?.uid;
      console.log('User UID:', uid);

      if (uid) {
        // Pertama, coba ambil data dari koleksi 'users'
        this.auth.getUser(uid, 'users').subscribe(
          async (userData: any) => {
            console.log('User data from users collection:', userData);
            if (userData) {
              if (userData.role === 'customer') {
                this.router.navigate(['customer-home']);
              } else {
                await this.auth.toast('Role pengguna tidak valid.');
              }
            } else {
              // Jika tidak ada data dari 'users', coba ambil dari koleksi 'user'
              this.auth.getUser(uid, 'user').subscribe(
                async (adminData: any) => {
                  console.log('User data from user collection:', adminData);
                  if (adminData) {
                    if (adminData.role === 'admin') {
                      this.router.navigate(['home']);
                    } else {
                      await this.auth.toast('Role pengguna tidak valid.');
                    }
                  } else {
                    // Jika tidak ada data dari 'user', coba ambil dari koleksi 'super_admins'
                    this.auth.getUser(uid, 'super_admins').subscribe(
                      async (superAdminData: any) => {
                        console.log('User data from super_admins collection:', superAdminData);
                        if (superAdminData) {
                          if (superAdminData.role === 'super_admins') {
                            this.router.navigate(['super-admin-home']);
                          } else {
                            await this.auth.toast('Role pengguna tidak valid.');
                          }
                        } else {
                          await this.auth.toast('Pengguna tidak ditemukan.');
                        }
                      },
                      async (error: any) => {
                        await this.auth.toast('Gagal mengambil data pengguna.');
                        console.error('Error fetching super admin data:', error);
                      }
                    );
                  }
                },
                async (error: any) => {
                  await this.auth.toast('Gagal mengambil data pengguna.');
                  console.error('Error fetching admin data:', error);
                }
              );
            }
          },
          async (error: any) => {
            await this.auth.toast('Gagal mengambil data pengguna.');
            console.error('Error fetching customer data:', error);
          }
        );
      } else {
        await this.auth.toast('Login gagal. User ID tidak ditemukan.');
        this.resetForm();
        await this.auth.logout();
      }
    } catch (err: any) {
      await this.auth.handleAuthError(err);
      this.resetForm();
    }
  }

 async daftar() {
    if (this.password !== this.confirmPassword) {
      await this.auth.toast('Kata sandi dan konfirmasi kata sandi tidak cocok');
      return;
    }

    try {
      // Pendaftaran pengguna di Firebase Auth
      const userCredential = await this.auth.register(this.email, this.password);
      const uid = userCredential.user?.uid;

      if (uid) {
        // Membuat objek informasi pengguna
        const userInfo = {
          uid: uid,
          email: this.email,
          nama: this.nama,
          role: this.selectedRole || 'customer' // Menggunakan selectedRole
        };

        // Simpan informasi pengguna ke koleksi yang sesuai
        if (this.selectedRole === 'admin') {
          await this.auth.saveUserInfo(userInfo, 'user'); // Simpan ke koleksi 'user' dengan role admin
          this.router.navigate(['home']); // Navigasi ke halaman admin
        } else {
          await this.auth.saveUserInfo(userInfo, 'users'); // Simpan ke koleksi 'users'
          this.router.navigate(['customer-home']); // Navigasi ke halaman customer
        }
      }
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        await this.auth.toast('Alamat email sudah digunakan oleh akun lain.');
      } else {
        await this.auth.toast('Gagal menyimpan informasi pengguna.');
      }
      console.error('Error saving user info:', err);
    }
  }


toggleForm() {
  this.isRegistering = !this.isRegistering;
}

private resetForm() {
  this.email = '';
  this.password = '';
  this.confirmPassword = '';
  this.nama = '';
  this.selectedRole = 'customer'; // Reset to default role
}}


/**
 * Variabel Utama:

email, password, confirmPassword, dan nama adalah variabel yang diikat ke form input di halaman login dan registrasi.
isRegistering adalah boolean yang mengatur apakah form sedang dalam mode login atau registrasi.
Fungsi login():

Fungsi ini menangani proses login. Jika pengguna berhasil login, akan diperiksa apakah data pengguna ada di Firestore pada koleksi 'users'. Jika ada, pengguna akan diarahkan ke halaman home.
Fungsi handleAuthError():

Fungsi ini menangani berbagai kode error yang mungkin muncul saat login (misalnya email tidak valid, pengguna tidak ditemukan, atau kata sandi salah).
Fungsi toggleForm():

Fungsi ini mengubah mode antara login dan registrasi.
Fungsi register():

Fungsi ini digunakan untuk proses registrasi pengguna baru. Setelah registrasi berhasil, data pengguna disimpan ke Firestore dan pengguna diarahkan ke halaman home.
Fungsi resetForm():

Fungsi ini digunakan untuk mereset form input setelah proses login atau registrasi selesai.

Tips Belajar:
Perhatikan bagaimana layanan (service) digunakan dalam komponen Angular untuk memisahkan logika bisnis dari tampilan.
Komentar di dalam kode memberikan penjelasan langkah demi langkah tentang apa yang dilakukan setiap bagian, yang akan membantu kamu memahami alur login dan registrasi.
Jangan ragu untuk bereksperimen dan memodifikasi kode ini sesuai dengan kebutuhan proyekmu.
 */
