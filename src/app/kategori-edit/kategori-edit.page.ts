import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-kategori-edit',
  templateUrl: './kategori-edit.page.html',
  styleUrls: ['./kategori-edit.page.scss'],
})
export class KategoriEditPage implements OnInit {

  id!: string; // ID kategori yang akan diedit
  kategori: any = {}; // Objek kategori, diinisialisasi sebagai objek kosong

  constructor(
    private route: ActivatedRoute, // Untuk mengambil parameter dari URL
    private auth: AuthService, // Service untuk operasi CRUD
    private nav: NavController // Untuk navigasi halaman
  ) {}

  // Fungsi untuk menghapus kategori
  hapus() {
    if (this.id) {
      this.auth.deleteProduct('kategori', this.id).then(() => {
        this.auth['toast']('Perubahan Kategori Disimpan'); // Menampilkan pesan sukses
        this.nav.back(); // Kembali ke halaman sebelumnya setelah menghapus
      }).catch(error => {
        console.error('Error saat menghapus kategori:', error);
        this.auth['toast']('Gagal menghapus kategori'); // Menampilkan pesan error
      });
    }
  }

  ngOnInit() {
    // Mengambil ID dari parameter URL saat komponen diinisialisasi
    this.id = this.route.snapshot.paramMap.get('id')!;
    console.log('KategoriEditPage initialized');
    this.loadKategori(); // Memanggil fungsi untuk memuat data kategori
  }

  // Fungsi untuk memuat data kategori berdasarkan ID
  loadKategori() {
    this.auth.get('kategori', this.id).subscribe((res: any) => {
      this.kategori = res; // Menyimpan data kategori yang diambil ke dalam variabel kategori
    });
  }

  // Fungsi untuk menyimpan perubahan kategori
  simpan() {
    console.log('Tombol Simpan diklik');
    this.auth.updateProduct('kategori', this.id, this.kategori).then(() => {
      this.auth['toast']('Perubahan Kategori Telah Disimpan'); // Menampilkan pesan sukses
    }).catch(error => {
      console.error('Error saat menyimpan kategori:', error);
      this.auth['toast']('Gagal menyimpan kategori'); // Menampilkan pesan error
    });
  }
}

/*
Import dan Deklarasi Dependensi:
ActivatedRoute digunakan untuk mengambil parameter dari URL.
AuthService adalah layanan yang menyediakan metode untuk operasi CRUD.
NavController digunakan untuk navigasi halaman.

Variabel:
id menyimpan ID kategori yang sedang diedit.
kategori adalah objek yang menyimpan data kategori.

Constructor:
Menerima dependensi yang diperlukan untuk komponen.

Fungsi hapus():
Menghapus kategori berdasarkan ID yang ada.
Menampilkan pesan sesuai dengan hasil operasi (sukses atau gagal) dan kembali ke halaman sebelumnya.

ngOnInit():
Dipanggil saat komponen diinisialisasi.
Mengambil ID kategori dari parameter URL dan memanggil loadKategori() untuk memuat data.

Fungsi loadKategori():
Mengambil data kategori dari layanan AuthService berdasarkan ID.
Menyimpan hasil data ke dalam variabel kategori.

Fungsi simpan():
Mengupdate data kategori menggunakan AuthService.
Menampilkan pesan sukses atau error sesuai dengan hasil operasi.
*/
