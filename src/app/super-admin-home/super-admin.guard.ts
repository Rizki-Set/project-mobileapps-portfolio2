// src/app/super-admin-home/super-admin.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SuperAdminGuard implements CanActivate {
  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.afAuth.currentUser.then(user => {
      if (user && user.email === 'superadmin@example.com') { // Ganti dengan logika yang sesuai
        return true;
      } else {
        this.router.navigate(['/login']); // Alihkan ke halaman login jika bukan superadmin
        return false;
      }
    }).catch(() => {
      this.router.navigate(['/login']);
      return false;
    });
  }
}

