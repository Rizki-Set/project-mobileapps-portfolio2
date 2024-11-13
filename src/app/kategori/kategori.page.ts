import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-kategori',
  templateUrl: './kategori.page.html',
  styleUrls: ['./kategori.page.scss'],
})
export class KategoriPage implements OnInit {

  // Deklarasi variabel untuk menampung data kategori dan status loading
  kategori: any[] = []; // Menyimpan data kategori yang diambil dari database
  loading: boolean = true; // Menandakan apakah data sedang dalam proses loading

  // Constructor untuk inject AuthService, yang digunakan untuk operasi CRUD
  constructor(public auth: AuthService) { }

  // Fungsi bawaan Ionic yang otomatis dipanggil setiap kali halaman ini selesai dimuat
  ionViewDidEnter() {
    this.loading = true; // Mengatur status loading menjadi true saat halaman baru dimuat

    // Mengambil data kategori dari service AuthService
    this.auth.collection('kategori').subscribe(
      res => {
        console.log('Data diterima:', res); // Log data yang diterima untuk debugging
        this.kategori = res; // Menyimpan data kategori yang diambil ke dalam variabel
        this.loading = false; // Mengatur status loading menjadi false setelah data diterima
      },
      error => {
        this.loading = false; // Menghentikan status loading meskipun terjadi error
        console.error('Error fetching kategori:', error); // Menampilkan error jika terjadi kesalahan
      }
    );
  }

  // Fungsi ngOnInit dijalankan ketika komponen pertama kali diinisialisasi
  ngOnInit() {
    console.log('KategoriPage initialized'); // Log untuk memastikan halaman sudah terinisialisasi
  }
}

/*
Variabel kategori dan loading:
kategori: Menyimpan data kategori yang diterima dari server atau database.
loading: Boolean untuk menandai apakah data masih dalam proses pengambilan. Berguna untuk menampilkan loading spinner atau animasi lain.

Constructor:
Menggunakan AuthService untuk melakukan operasi CRUD, seperti mengambil data kategori dari server.

Fungsi ionViewDidEnter():
Fungsi ini dijalankan setiap kali halaman selesai dimuat. Di sini, kita mengambil data kategori dari server.
Data diambil menggunakan AuthService.collection('kategori'), yang mengembalikan observable. Kita berlangganan (subscribe) ke observable ini untuk menerima data.
Jika data berhasil diambil, status loading diubah menjadi false dan data disimpan ke dalam variabel kategori.
Jika terjadi error, status loading tetap diubah menjadi false dan error akan dicatat di console.

Fungsi ngOnInit():
Fungsi ini dijalankan saat halaman pertama kali diinisialisasi (hanya sekali). Biasanya digunakan untuk inisialisasi data atau log sederhana.
*/
