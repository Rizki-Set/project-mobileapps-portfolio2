import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';

const redirectTologin = () => redirectUnauthorizedTo(['login']);
const redirectTohome = () => redirectLoggedInTo(['home']);

const routes: Routes = [

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
 {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
  canActivate: [AngularFireAuthGuard],
  data:{authGuardPipe: redirectTologin }
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
     canActivate: [AngularFireAuthGuard],
   data:{authGuardPipe: redirectTohome}
  },
  {
    path: 'akun',
    loadChildren: () => import('./akun/akun.module').then( m => m.AkunPageModule),
     canActivate: [AngularFireAuthGuard],
  data:{authGuardPipe: redirectTologin }
  },
  {
    path: 'kategori',
    loadChildren: () => import('./kategori/kategori.module').then( m => m.KategoriPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
