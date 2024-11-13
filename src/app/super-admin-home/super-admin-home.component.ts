import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Mengimpor layanan autentikasi
import { Router } from '@angular/router'; // Mengimpor Router untuk navigasi

@Component({
  selector: 'app-super-admin-home',
  templateUrl: './super-admin-home.component.html',
  styleUrls: ['./super-admin-home.component.scss'],
})
export class SuperAdminHomeComponent implements OnInit {

  users: any[] = [];
  public userDetails: any[] = [];

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.loadUsers();
    this.loadUserDetails();
  }

  loadUsers() {
    this.auth.getUsers().subscribe(usersData => {
      this.users = usersData;
      console.log('Users:', this.users);
    });
  }

  loadUserDetails() {
    this.auth.getUserDetails().subscribe(userDetailsData => {
      this.userDetails = userDetailsData;
      console.log('User Details:', this.userDetails);
    });
  }

  deleteUser(userId: string) {
    this.auth.deleteUserInfo(userId, 'users').then(() => {
      this.loadUsers(); // Refresh user list after deletion
    }).catch(error => {
      console.error('Error deleting user:', error);
    });
  }

  deleteAdmin(adminId: string) {
    this.auth.deleteUserInfo(adminId, 'user').then(() => {
      this.loadUserDetails(); // Refresh admin list after deletion
    }).catch(error => {
      console.error('Error deleting admin:', error);
    });
  }

  viewUserDetails(userId: string) {
    // Implementasi untuk melihat detail pengguna
    console.log('Viewing details for user:', userId);
  }

  logout() {
    this.auth.logout().then(() => {
      // Logout berhasil, Anda bisa melakukan sesuatu di sini jika perlu
    }).catch((error: any) => {
      console.error('Logout error:', error);
      // Optional: handle logout error here
    });
  }
}



