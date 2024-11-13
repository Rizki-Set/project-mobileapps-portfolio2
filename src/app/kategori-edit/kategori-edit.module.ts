import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KategoriEditPageRoutingModule } from './kategori-edit-routing.module';

import { KategoriEditPage } from './kategori-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KategoriEditPageRoutingModule
  ],
  declarations: [KategoriEditPage]
})
export class KategoriEditPageModule {}
