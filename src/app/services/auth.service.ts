import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { map, take, finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http'; // Tambahkan HttpClient
import { catchError } from 'rxjs/operators';
import { PaymentResponse } from '../models/new-types';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, from, of, throwError } from 'rxjs'; // Pastikan throwError diimpor
import { environment } from '../../environments/environment';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { Product } from '../models/products.models';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  signOut() {
    throw new Error('Method not implemented.');
  }
  deleteUser(userId: string) {
    throw new Error('Method not implemented.');
  }

  /*
  private apiUrl = 'http://localhost:30001'; // Ganti dengan URL API Anda
*/

  constructor(
    private router: Router, // Untuk navigasi halaman
    private auth: AngularFireAuth, // Untuk autentikasi pengguna
    private toastController: ToastController, // Untuk menampilkan notifikasi
    private firestore: AngularFirestore, // Untuk akses Firestore
    private storage: AngularFireStorage, // Untuk akses Firebase Storage
    private http: HttpClient
  ) { }


 /**
   * Mendapatkan pengguna saat ini.
   * Implementasi ini harus diganti dengan sistem autentikasi nyata.
   * @returns Promise yang menyelesaikan dengan data pengguna saat ini.
   */

  saveOrder(order: any) {
    return this.firestore.collection('orders').add(order);
  }

 /**
   * Mengambil daftar produk dari server.
   * @returns Observable yang menghasilkan array produk.
   */
  /*
getProducts(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/products`).pipe(
    catchError(this.handleError)
  );
}
*/


  // Method untuk mendapatkan data pesanan berdasarkan ID
getOrdersById(userId: string): Observable<any[]> {
    return this.firestore.collection('orders', ref => ref.where('userId', '==', userId)).valueChanges();
  }

  // Method untuk memperbarui status pesanan
  // Update order status, quantity, and total price
async updateOrderStatus(orderId: string, status: string, quantity: number, totalPrice: number) {
  const orderRef = this.firestore.collection('orders').doc(orderId);
  return orderRef.update({
    status: status,
    quantity: quantity,
    totalPrice: totalPrice
  });
}


  // Method untuk membuat pembayaran (payment intent) - Ini hanya placeholder
  createPaymentIntent(orderId: string): Observable<any> {
    // Memanggil backend kamu untuk membuat payment intent dan mengembalikan client secret
    // Ini adalah placeholder. Implementasikan sesuai dengan API backend kamu.
    return this.firestore.collection('payments').doc(orderId).valueChanges();
  }


// Method untuk membuat pembayaran (payment intent)
/*
createPaymentIntent(orderId: string): Observable<PaymentResponse> {
  return this.http.post<PaymentResponse>(`${this.apiUrl}/create-payment-intent`, { orderId });
}*/


  // Mengambil informasi pengguna berdasarkan UID
  getCustomerInfo(uid: string) {
    return this.firestore.collection('users').doc(uid).valueChanges().pipe(take(1));
  }

  // Method untuk menyimpan pesanan ke Firestore
  saveCustomerOrder(userId: string, order: any) {
    return this.firestore.collection('orders').add({
      userId: userId,
      ...order,
          status: 'Pending',  // Tambahkan status default
      timestamp: new Date() // Menyimpan waktu pesanan dibuat
    });
  }

    /**
   * Menangani error dari permintaan HTTP.
   * @param error Kesalahan dari permintaan HTTP.
   * @returns Observable kosong untuk menangani error.
   */
 private handleError(error: HttpErrorResponse): Observable<never> {
  console.error('Terjadi kesalahan:', error.message);
  return throwError('Terjadi kesalahan saat memproses permintaan. Silakan coba lagi nanti.');
}



  // Mengambil semua produk dari koleksi 'products'
  getProducts(): Observable<any[]> {
    return this.firestore.collection('products').snapshotChanges().pipe(
      map(snapshot => snapshot.map(doc => {
        console.log('Firestore snapshot:', snapshot); // Debugging
        const data = doc.payload.doc.data() as any;
        const id = doc.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  // Mengambil semua order berdasarkan userId
getOrdersByUserId(userId: string): Observable<any[]> {
  return this.firestore.collection('orders', ref => ref.where('userId', '==', userId)).snapshotChanges().pipe(
    map(snapshot => snapshot.map(doc => {
      const data = doc.payload.doc.data() as any;
      const id = doc.payload.doc.id;
      return { id, ...data };
    }))
  );
}


  // Tambahkan method ini
  getProductById(productId: string): Observable<any> {
    return this.firestore.collection('products').doc(productId).valueChanges();
  }

  // Mendaftar pengguna baru dengan email dan kata sandi
  register(email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  // Menyimpan informasi pengguna ke koleksi 'users' di Firestore
// Simpan informasi pengguna ke koleksi yang sesuai
async saveUserInfo(userInfo: any, collectionName: string) {
  const db = getFirestore();
  try {
    // Menyimpan data pengguna ke koleksi yang ditentukan
    const userDoc = doc(db, collectionName, userInfo.uid); // Gunakan ID pengguna sebagai dokumen ID
    await setDoc(userDoc, userInfo);
    console.log(`User info saved to ${collectionName}:`, userInfo);
  } catch (error) {
    console.error('Error saving user info:', error);
    throw error;
  }
}

  // Metode untuk mengambil data pengguna berdasarkan role
getUser(uid: string, role: 'user' | 'users' | 'super_admins'): Observable<any> {
  if (role === 'user') {
    return this.getAdmin(uid); // Admin data
  } else if (role === 'users') {
    return this.getCustomer(uid); // Customer data
  } else if (role === 'super_admins') {
    return this.getSuperAdmin(uid); // Super Admin data
  }
  return of(null); // Return empty observable if role is not found
}

  getUsers() {
    return this.firestore.collection('users').valueChanges({ idField: 'id' });
  }

  getUserDetails() {
    return this.firestore.collection('user').valueChanges({ idField: 'id' });
  }

    deleteUserInfo(userId: string, collection: string) {
    return this.firestore.collection(collection).doc(userId).delete();
  }


   getAllUsers(): Observable<any[]> {
    return this.firestore.collection('users').valueChanges();
  }

// Mengambil data pengguna dari koleksi 'users' berdasarkan UID
getCustomer(uid: string): Observable<any> {
  return this.firestore.collection('users').doc(uid).valueChanges().pipe(take(1));
}

// Mengambil data pengguna dari koleksi 'user' berdasarkan UID
getAdmin(uid: string): Observable<any> {
  return this.firestore.collection('user').doc(uid).valueChanges().pipe(take(1));
}

 // Menambah metode untuk mengambil data super admin
  getSuperAdmin(uid: string): Observable<any> {
    return this.firestore.collection('super_admins').doc(uid).valueChanges().pipe(take(1));
  }

  // Login pengguna dengan email dan kata sandi
async signInWithEmailAndPassword(email: string, password: string) {
  console.log('Attempting to sign in with:', email);
  try {
    return await this.auth.signInWithEmailAndPassword(email, password);
  } catch (error) {
    console.error('Error during sign-in:', error);
    throw error;
  }
}

  // Menangani kesalahan saat login dan menampilkan notifikasi error
async handleAuthError(err: any) {
  console.error('Auth error:', err);
  let errorMsg = 'Login gagal. Silakan coba lagi.';
  switch (err.code) {
    case 'auth/invalid-email':
      errorMsg = 'Format email salah.';
      break;
    case 'auth/user-not-found':
      errorMsg = 'Akun tidak ditemukan.';
      break;
    case 'auth/wrong-password':
      errorMsg = 'Kata sandi salah.';
      break;
  }
  await this.toast(errorMsg);
}

  // Menampilkan notifikasi toast
  async toast(message: string) {
    const toast = await this.toastController.create({
      message,
      position: 'top',
      duration: 3000,
      buttons: [{ icon: "close", side: "end" }]
    });
    await toast.present();
  }

  // Logout pengguna dan arahkan ke halaman login
logout(): Promise<void> {
  return this.auth.signOut().then(() => {
    this.router.navigate(['login']);
  }).catch(error => {
    console.error('Logout error:', error);
  });
}


  // Mengambil dokumen dari koleksi berdasarkan ID dokumen
  get(collection: string, docId: string) {
    return this.firestore.collection(collection).doc(docId).valueChanges().pipe(take(1));
  }

  // Mengambil semua dokumen dari koleksi
  collection(collection: string) {
    return this.firestore.collection(collection).valueChanges({ idField: 'id' }).pipe(take(1));
  }

  // Menambahkan dokumen baru ke koleksi
addProduct(collection: string, data: Product) {
  return this.firestore.collection(collection).add(data);
}

  // Memperbarui dokumen di koleksi berdasarkan ID dokumen
updateProduct(collection: string, docId: string, data: Product) {
  return this.firestore.collection(collection).doc(docId).update(data);
}

  // Menghapus dokumen dari koleksi berdasarkan ID dokumen
  deleteProduct(collection: string, docId: string) {
    return this.firestore.collection(collection).doc(docId).delete();
  }

  // Mengambil produk berdasarkan penjual
getProductsBySeller(sellerId: string): Observable<any[]> {
  return this.firestore.collection('products', ref => ref.where('adminId', '==', sellerId)).valueChanges();
}



  // Mengunggah file ke Firebase Storage dan mendapatkan URL download
  async uploadFile(file: File, path: string): Promise<string | null> {
    const filePath = `${path}/${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    return new Promise((resolve, reject) => {
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().toPromise().then(
            (url) => resolve(url),
            (error) => reject(error)
          );
        })
      ).subscribe();
    });
  }

  // Method untuk memperbarui item di keranjang
async updateCartItem(productId: string, quantity: number): Promise<void> {
  try {
    const user = await this.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    const userId = user.uid;
    await this.firestore.collection('cart').doc(userId).collection('items').doc(productId).set({
      quantity: quantity,
      // Anda bisa menambahkan field `price` jika diperlukan, atau mengupdate harga jika ada perubahan
    }, { merge: true });
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
}

getCurrentUser(): Promise<any> {
  return new Promise((resolve, reject) => {
    this.auth.authState.subscribe(user => {
      if (user) {
        resolve(user);
      } else {
        resolve(null); // Mengembalikan null jika tidak ada pengguna
      }
    }, error => reject(error));
  });
}


// Method untuk mendapatkan jumlah item di keranjang
async getCartItemCount(): Promise<number> {
  try {
    const user = await this.getCurrentUser();
    const userId = user.uid;
    const snapshot = await this.firestore.collection('cart').doc(userId).collection('items').get().toPromise();

    if (!snapshot) {
      throw new Error('Snapshot is undefined');
    }

    let count = 0;
    snapshot.forEach(doc => {
      count += (doc.data() as any).quantity || 0;
    });

    return count;
  } catch (error) {
    console.error('Error getting cart item count:', error);
    throw error;
  }
}


  async removeFromCart(itemId: string, userId: string): Promise<void> {
    await this.firestore.doc(`cart/${userId}/items/${itemId}`).delete();
  }

getCartItems(userId: string): Observable<any[]> {
  return this.firestore.collection(`cart/${userId}/items`).valueChanges({ idField: 'id' });
}

 async updateProductStock(productId: string, newStock: number) {
    // Implement the logic to update the product stock in your database
    // For example, if using Firebase Firestore:
    return this.firestore.collection('products').doc(productId).update({
      stock: newStock
    });
  }




}

/*
METODE YANG TERSEDIA

1. User Authentication
signOut(): Metode yang belum diimplementasikan untuk keluar dari sesi pengguna.
register(email: string, password: string): Mendaftar pengguna baru dengan email dan password.
signInWithEmailAndPassword(email: string, password: string): Masuk dengan email dan password.
handleAuthError(err: any): Menangani kesalahan otentikasi dan menampilkan notifikasi error.
logout(): Keluar dari sesi pengguna dan mengarahkan ke halaman login.
getCurrentUser(): Mengambil informasi pengguna saat ini.
2. User Data Management
saveUserInfo(userInfo: any, collectionName: string): Menyimpan informasi pengguna ke koleksi yang ditentukan di Firestore.
getUser(uid: string, role: 'user' | 'users' | 'super_admins'): Mengambil data pengguna berdasarkan peran.
getCustomer(uid: string): Mengambil data pengguna dari koleksi users berdasarkan UID.
getAdmin(uid: string): Mengambil data pengguna dari koleksi user berdasarkan UID.
getSuperAdmin(uid: string): Mengambil data pengguna dari koleksi super_admins berdasarkan UID.
getUsers(): Mengambil semua pengguna dari koleksi users.
getUserDetails(): Mengambil detail pengguna dari koleksi user.
deleteUserInfo(userId: string, collection: string): Menghapus informasi pengguna dari koleksi yang ditentukan.
getAllUsers(): Mengambil semua pengguna dari koleksi users.
3. Product Management
getProducts(): Mengambil semua produk dari koleksi products.
getProductById(productId: string): Mengambil produk berdasarkan ID.
addProduct(collection: string, data: Product): Menambahkan produk baru ke koleksi yang ditentukan.
updateProduct(collection: string, docId: string, data: Product): Memperbarui produk di koleksi berdasarkan ID.
deleteProduct(collection: string, docId: string): Menghapus produk dari koleksi berdasarkan ID.
getProductsBySeller(sellerId: string): Mengambil produk berdasarkan ID penjual.
updateProductStock(productId: string, newStock: number): Memperbarui stok produk berdasarkan ID.
4. Order Management
saveOrder(order: any): Menyimpan pesanan baru ke koleksi orders.
getOrdersById(userId: string): Mengambil daftar pesanan berdasarkan ID pengguna.
updateOrderStatus(orderId: string, status: string): Memperbarui status pesanan berdasarkan ID.
createPaymentIntent(orderId: string): Membuat pembayaran (payment intent), placeholder untuk API backend.
5. Cart Management
updateCartItem(productId: string, quantity: number): Memperbarui item di keranjang belanja.
getCartItemCount(): Mengambil jumlah item di keranjang belanja.
removeFromCart(itemId: string, userId: string): Menghapus item dari keranjang belanja berdasarkan ID item dan ID pengguna.
getCartItems(userId: string): Mengambil semua item di keranjang belanja berdasarkan ID pengguna.
6. File Storage
uploadFile(file: File, path: string): Promise<string | null>: Mengunggah file ke Firebase Storage dan mendapatkan URL download.
7. Integration and Other Services
fetchDataFromApi(): Mengambil data dari API eksternal. (Belum didefinisikan secara spesifik dalam kode yang diberikan.)
handleError(error: HttpErrorResponse): Observable<never>: Menangani kesalahan dari permintaan HTTP.

1. User Authentication:
signOut()
register()
signInWithEmailAndPassword()
handleAuthError()
logout()
getCurrentUser()

2. User Data Management:
saveUserInfo()
getUser()
getCustomer()
getAdmin()
getSuperAdmin()
getUsers()
getUserDetails()
deleteUserInfo()
getAllUsers()

3. Product Management:
getProducts()
getProductById()
addProduct()
updateProduct()
deleteProduct()
getProductsBySeller()
updateProductStock()

4. Order Management:
saveOrder()
getOrdersById()
updateOrderStatus()
createPaymentIntent()

5. Cart Management:
updateCartItem()
getCartItemCount()
removeFromCart()
getCartItems()

6.File Storage:
uploadFile()

7. Integration and Other Services:
handleError()
*/
