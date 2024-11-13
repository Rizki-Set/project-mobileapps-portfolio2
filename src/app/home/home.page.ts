import { Component } from '@angular/core';

@Component({
  selector: 'app-home', // Selector ini digunakan untuk mengidentifikasi komponen di template HTML
  templateUrl: 'home.page.html', // Lokasi file template HTML yang digunakan untuk komponen ini
  styleUrls: ['home.page.scss'], // Lokasi file style (SCSS) yang digunakan untuk komponen ini
})
export class HomePage {

  constructor() {}

  // Array 'menu' yang menyimpan data menu yang akan ditampilkan di halaman home
  // Setiap item dalam array ini memiliki label (nama menu), icon, dan link untuk navigasi
  menu: { label: string, icon: string, link: string }[] = [
    { label: 'Kategori', icon: 'file-tray-stacked', link: '/kategori' }, // Menu untuk kategori
    { label: 'Produk', icon: 'cart', link: '/produk' }, // Menu untuk produk
    { label: 'Transaksi', icon: 'cash', link: '/transaksi' }, // Menu untuk transaksi
    { label: 'Laporan', icon: 'analytics', link: '/laporan' } // Menu untuk laporan
  ];
}

/**
@Component: Dekorator yang digunakan untuk mendefinisikan komponen Angular. Di sini, kita menentukan selector (app-home), template HTML (home.page.html), dan style (home.page.scss) untuk komponen ini.

Array menu:
Setiap objek di dalam array berisi tiga properti:
label: Nama menu yang akan ditampilkan kepada pengguna.
icon: Ikon yang akan ditampilkan di samping nama menu (menggunakan ikon dari Ionic).
link: Rute (URL) yang akan diarahkan ketika menu diklik.

Tujuan: Komponen ini digunakan sebagai halaman utama aplikasi, menampilkan beberapa opsi navigasi seperti "Kategori", "Produk", "Transaksi", dan "Laporan".

Implementasi di Template (HTML):
 */
