import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule} from '@angular/fire/compat/storage';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { AngularFireModule } from '@angular/fire/compat';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment'; // Hanya satu impor environment
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService} from './services/auth.service'; // Pastikan ini diimpor



@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    IonicModule.forRoot(),
      FormsModule,
       ReactiveFormsModule,
    AppRoutingModule
  ],

  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
