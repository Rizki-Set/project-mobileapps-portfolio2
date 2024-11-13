import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerHomePageRoutingModule } from './customer-home-routing.module';

import { CustomerHomePage } from './customer-home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerHomePageRoutingModule
  ],
  declarations: [CustomerHomePage]
})
export class CustomerHomePageModule {}
