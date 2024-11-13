import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { PaymentErrorComponent } from './payment-error/payment-error.component';
import { PaymentPage } from './payment/payment.page';
import { SuperAdminGuard } from './super-admin-home/super-admin.guard'; // Import the guard



// Buat yang belum login ada hal tertentu yang dibatasi akan kembali ke login
const redirectTologin = () => redirectUnauthorizedTo(['login']);
// Saat sudah login ada hal tertentu yang sudah dibatasi akan lari kehalaman home
const redirectTohome = () => redirectLoggedInTo(['home']);

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectTologin }
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectTohome }
  },
  {
    path: 'akun',
    loadChildren: () => import('./akun/akun.module').then(m => m.AkunPageModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectTologin }
  },
  {
    path: 'kategori',
    loadChildren: () => import('./kategori/kategori.module').then(m => m.KategoriPageModule)
  },
  {
    path: 'kategori-add',
    loadChildren: () => import('./kategori-add/kategori-add.module').then(m => m.KategoriAddPageModule)
  },
  {
    path: 'kategori-edit/:id',
    loadChildren: () => import('./kategori-edit/kategori-edit.module').then(m => m.KategoriEditPageModule)
  },
  {
    path: 'produk',
    loadChildren: () => import('./produk/produk.module').then(m => m.ProdukPageModule)
  },
  {
    path: 'customer-home',
    loadChildren: () => import('./customer-home/customer-home.module').then(m => m.CustomerHomePageModule)
  },
  {
    path: 'order-report',
    loadChildren: () => import('./order-report/order-report.module').then(m => m.OrderReportPageModule)
  },
  {
    path: 'payment',
    loadChildren: () => import('./payment/payment.module').then(m => m.PaymentPageModule)
  },
  { path: 'payment-success', component: PaymentSuccessComponent },
  { path: 'payment-error', component: PaymentErrorComponent },

 // Rute untuk super_admins
{
  path: 'super-admin-home',
  loadChildren: () => import('./super-admin-home/super-admin-home.module').then(m => m.SuperAdminHomeModule),
  canActivate: [SuperAdminGuard]
},
  {
    path: 'cart',
    loadChildren: () => import('./cart/cart.module').then( m => m.CartPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}


  // Hapus rute berikut:
  // {
  //   path: 'transaksi',
  //   loadChildren: () => import('./transaksi/transaksi.module').then(m => m.TransaksiPageModule)
  // },
  // {
  //   path: 'laporan',
  //   loadChildren: () => import('./laporan/laporan.module').then(m => m.LaporanPageModule)
  // },
  // {
  //   path: 'keranjang',
  //   loadChildren: () => import('./keranjang/keranjang.module').then( m => m.KeranjangPageModule)
  // },
