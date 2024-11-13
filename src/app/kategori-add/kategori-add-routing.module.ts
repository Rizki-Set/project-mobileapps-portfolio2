import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KategoriAddPage } from './kategori-add.page';

const routes: Routes = [
  {
    path: '',
    component: KategoriAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KategoriAddPageRoutingModule {}
