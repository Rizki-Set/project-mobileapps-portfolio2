import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { SuperAdminHomeComponent } from './super-admin-home.component';
import { SuperAdminHomeRoutingModule } from './super-admin-home-routing.module';


const routes: Routes = [
  {
    path: '',
    component: SuperAdminHomeComponent
  }
];

@NgModule({
  declarations: [SuperAdminHomeComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    SuperAdminHomeRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SuperAdminHomeModule { }


