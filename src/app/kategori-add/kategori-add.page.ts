import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-kategori-add',
  templateUrl: './kategori-add.page.html',
  styleUrls: ['./kategori-add.page.scss'],
})
export class KategoriAddPage implements OnInit {

  constructor(
    public auth: AuthService
  ) {}

  // Objek kategori dengan properti sub (array untuk subkategori)
  kategori: any = { sub: [] };

  // Variabel untuk menyimpan input subkategori
  subkategori: string | null = null;

  // Fungsi untuk menambah subkategori ke dalam array sub
  addSub() {
    if (this.subkategori) {
      // Tambahkan subkategori ke array jika input tidak kosong
      this.kategori.sub.push(this.subkategori);
      // Reset input subkategori setelah berhasil ditambahkan
      this.subkategori = null;
    }
  }

  // Fungsi untuk menghapus subkategori dari array sub
  removeSub(item: string) {
    const index = this.kategori.sub.indexOf(item);
    if (index > -1) {
      // Hapus subkategori berdasarkan index
      this.kategori.sub.splice(index, 1);
    }
  }

  // Fungsi untuk menyimpan data kategori
  simpan() {
    this.auth.addProduct('kategori', this.kategori).then(() => {
      // Tampilkan pesan jika data berhasil disimpan
      this.auth['toast']("Data kategori telah disimpan");
      // Reset objek kategori dan input subkategori setelah penyimpanan
      this.kategori = { sub: [] };
      this.subkategori = '';
      console.log("Menyimpan kategori", this.kategori.sub);
    });
  }

  // Fungsi ini berjalan ketika halaman selesai dimuat
  ionViewDidEnter() {
    // Pastikan subkategori adalah array
    this.kategori.sub = this.kategori.sub || [];
    console.log('ionViewDidEnter:', this.kategori.sub);
  }

  // Fungsi untuk menambah subkategori (alternatif jika menggunakan metode lain)
  tambahSubkategori() {
    if (this.subkategori) {
      // Tambahkan subkategori ke dalam array subkategori
      this.kategori.sub.push(this.subkategori);
      // Kosongkan input setelah menambah subkategori
      this.subkategori = '';
      console.log("Menambahkan subkategori", this.kategori.sub); // Log untuk debugging
    }
  }

  ngOnInit() {
    console.log('KategoriAddPage initialized');
    // Pastikan array subkategori terinisialisasi
    this.kategori.sub = this.kategori.sub || [];
  }
}

/*
Properti kategori:
Objek kategori memiliki properti sub, yang berfungsi sebagai array untuk menyimpan subkategori.

Variabel subkategori:
Variabel subkategori digunakan untuk menyimpan input sementara sebelum ditambahkan ke dalam array sub.

Fungsi addSub():
Menambahkan subkategori ke array sub hanya jika input subkategori tidak kosong. Setelah berhasil menambah, input direset menjadi null.

Fungsi removeSub(item: string):
Menghapus subkategori dari array berdasarkan index-nya.

Fungsi simpan():
Menyimpan data kategori menggunakan AuthService. Setelah data disimpan, semua input dan array subkategori direset.

Lifecycle Method ionViewDidEnter():
Memastikan bahwa array sub selalu terinisialisasi ketika halaman dimuat.

Fungsi tambahSubkategori():
Alternatif fungsi menambah subkategori dengan prinsip yang sama seperti addSub().

Lifecycle Method ngOnInit():
Menginisialisasi array sub saat halaman pertama kali di-load.
*/

