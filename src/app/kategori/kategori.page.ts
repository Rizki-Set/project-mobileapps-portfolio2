import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-kategori',
  templateUrl: './kategori.page.html',
  styleUrls: ['./kategori.page.scss'],
})
export class KategoriPage  {

  constructor(
    public auth:AuthService
  ) { }

kategori : any;

  // Ketika halaman load berpindah fungsi ini dijalannkan
  // Buat fungsi yg menyambung daengan crud
  ionViewDidEnter() {
    this.auth.collection('kategori').subscribe(res => {
      this.kategori = res;
      console.log(this.kategori); // Debug: Periksa data yang diterima
    });
  }

  ngOnInit() {
    console.log('KategoriPage initialized');
  }
}
