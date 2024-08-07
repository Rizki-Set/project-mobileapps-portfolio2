
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    private auth: AngularFireAuth,
    private toastController: ToastController,
    private firestore: AngularFirestore
  ) { }

  async toast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      position: 'top',
      duration: 3000,
      buttons: [
        { icon: "close", side: "end" }
      ]
    });
    await toast.present();
  }

  login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    console.log('Logout Dipanggil');
    this.auth.signOut().then(() => {
      this.router.navigate(['login']);
    });
  }

   user(uid: string) {
    return this.firestore.collection('user').doc(uid).valueChanges().pipe(take(1));
  }

// Note, kalo collection ngambil list nya banyak datanya sedangkan doc ambil satu dokumen nya saja
// Firestore
collection(collection: string){
  return this.firestore.collection(collection).valueChanges({idField: 'id'}).pipe(take(1));
}

// Tidak menampilkan id fiel
// Ini read nya
doc(collection: string, doc: string) {
return this.firestore.collection(collection).doc(doc).valueChanges().pipe(take(1));
}

// Fungsi Add
add(collection: string,data: any){
return this.firestore.collection(collection).add(data);
}
// Fungsi Update
update(collection: string,doc: string, data: any){
return this.firestore.collection(collection).doc(doc).update(data);
}
// Fungsi Delete
delete(collection: string,doc: string,) {
return this.firestore.collection(collection).doc(doc).delete();
}
}


