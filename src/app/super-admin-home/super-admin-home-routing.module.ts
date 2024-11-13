import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperAdminHomeComponent } from './super-admin-home.component';

const routes: Routes = [
  {
    path: '',
    component: SuperAdminHomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperAdminHomeRoutingModule {}
