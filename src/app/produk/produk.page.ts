/**
 * @Created by          : Rizki Setiawan (Rizkisetiawan1616@gmail.com)
 * @Date                : 2024-08-02 20:33
 * @File name           : produk.page.ts
 */

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LoadingController, ToastController } from '@ionic/angular';


@Component({
  selector: 'app-produk',
  templateUrl: './produk.page.html',
  styleUrls: ['./produk.page.scss'],
})
export class ProdukPage implements OnInit {
  products: any[] = []; // Daftar produk yang akan ditampilkan
  selectedFile: File | null = null; // File yang dipilih untuk diunggah
  newProduct: any = { name: '', price: 0, imageUrl: '', stock: 0,description: '', }; // Data produk baru
  isEditing: boolean = false; // Status apakah sedang dalam mode edit
  showAddProductForm: boolean = false; // Status apakah form tambah produk ditampilkan
  editProductData: any = { id: '', name: '', price: 0, imageUrl: '',stock: 0 ,description: '' }; // Data produk yang sedang diedit

  constructor(
    private authService: AuthService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { }

  async ngOnInit() {
    await this.loadProducts(); // Memuat produk saat halaman diinisialisasi
  }

  // Memuat daftar produk dari layanan
async loadProducts() {
  const loading = await this.loadingController.create({
    message: 'Loading products...',
    spinner: 'crescent'
  });
  await loading.present();

  this.authService.getProducts().subscribe(
    (data) => {
      console.log('Products data:', data); // Debugging
      this.products = data || []; // Pastikan products tidak undefined
      loading.dismiss();
    },
    async (error) => {
      console.error('Error loading products:', error);
      await this.showToast('Failed to load products.'); // Tampilkan pesan toast jika gagal
      loading.dismiss();
    }
  );
}

  // Menangani upload file
  async uploadFile(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // Menambahkan produk baru
async addProduct() {
  if (this.selectedFile) {
    this.newProduct.imageUrl = await this.authService.uploadFile(this.selectedFile, 'products') ?? '';
  }

  try {
    await this.authService.addProduct('products', this.newProduct);
    await this.showToast('Product added successfully!');
  } catch (error) {
    console.error('Error adding product:', error);
    await this.showToast('Failed to add product.');
  } finally {
    this.resetForm(); // Reset form dan muat ulang produk di akhir
    await this.loadProducts();
  }
}

  // Mengedit produk yang ada
async editProduct() {
  if (this.selectedFile) {
    this.editProductData.imageUrl = await this.authService.uploadFile(this.selectedFile, 'products') ?? '';
  }

  try {
    await this.authService.updateProduct('products', this.editProductData.id, this.editProductData);
    await this.showToast('Product updated successfully!');
  } catch (error) {
    console.error('Error updating product:', error);
    await this.showToast('Failed to update product.');
  } finally {
    this.resetForm(); // Reset form dan muat ulang produk di akhir
    await this.loadProducts();
  }
}


  // Menghapus produk berdasarkan ID
  async deleteProduct(id: string) {
    try {
      await this.authService.deleteProduct('products', id);
      await this.showToast('Product deleted successfully!');
      await this.loadProducts(); // Muat ulang daftar produk
    } catch (error) {
      console.error('Error deleting product:', error);
      await this.showToast('Failed to delete product.'); // Tampilkan pesan toast jika gagal
    }
  }

  // Menampilkan pesan toast
  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      cssClass: 'toast-wrapper'  // Menambahkan kelas CSS khusus

    });
    await toast.present();
  }

  // Menampilkan form tambah produk
  showAddForm() {
    this.showAddProductForm = true;
  }

  // Menyembunyikan form tambah produk dan mereset data
  hideAddForm() {
    this.resetForm();
  }

  // Menyiapkan data untuk edit produk
  editProductWithParams(product: any) {
    this.isEditing = true;
    this.editProductData = { ...product, imageUrl: product.imageUrl ?? '' }; // Set default value untuk imageUrl
  }

  // Membatalkan mode edit dan mereset data
  cancelEdit() {
    this.resetForm();
  }


  // Mereset form dan status
  private resetForm() {
    this.newProduct = { name: '', price: 0, imageUrl: '',description: '',stock: ''  };
    this.selectedFile = null;
    this.showAddProductForm = false;
    this.isEditing = false;
    this.editProductData = { id: '', name: '', price: 0, imageUrl: '',description: '', stock: ''  }; // Set default value untuk imageUrl
  }
}

/*
Komentar pada Variabel: Menjelaskan tujuan dan penggunaan setiap variabel di dalam kelas.
Komentar pada Fungsi: Menjelaskan tujuan dari setiap fungsi, seperti memuat produk, menambahkan produk, mengedit produk, dan menghapus produk.
Komentar pada Bagian Penting: Menjelaskan logika di dalam fungsi, seperti menangani file upload dan mengatur nilai default untuk menghindari nilai null.
*/

