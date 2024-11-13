import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-home',
  templateUrl: './customer-home.page.html',
  styleUrls: ['./customer-home.page.scss'],
})
export class CustomerHomePage implements OnInit {
  products: any[] = [];
  currentUserId: string = '';
  cartCount: number = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    await this.loadCurrentUser();
    await this.loadProducts();
    await this.updateCartCount();
  }

  async loadCurrentUser() {
    try {
      const user = await this.authService.getCurrentUser();
      if (user) {
        this.currentUserId = user.uid;
        console.log('User ID:', this.currentUserId);
      } else {
        console.error('User not authenticated');
        await this.showToast('Pengguna tidak terautentikasi.');
      }
    } catch (error) {
      console.error('Error loading current user:', error);
      await this.showToast('Gagal memuat data pengguna.');
    }
  }

  async updateCartCount() {
    try {
      this.cartCount = await this.authService.getCartItemCount();
    } catch (error) {
      console.error('Error updating cart count:', error);
      this.cartCount = 0;
    }
  }

  async loadProducts() {
    try {
      this.authService.getProducts().subscribe(
        (products: any[]) => {
                  this.products = products.map(product => ({
          ...product,
          stock: product.stock || 0 }));
          console.log('Products loaded:', this.products);
        },
        (error: any) => {
          console.error('Error loading products:', error);
          this.showToast('Gagal memuat produk.');
        }
      );
    } catch (error) {
      console.error('Error in loadProducts:', error);
      this.showToast('Gagal memuat produk.');
    }
  }

  async orderProduct(product: any) {
    try {
      const order = {
        userId: this.currentUserId,
        productId: product.id,
        quantity: product.quantity || 1,
        totalPrice: (product.quantity || 1) * product.price,
      };

      await this.authService.saveCustomerOrder(this.currentUserId, order);
       // Reduce the product stock
    await this.reduceProductStock(product);
      await this.authService.updateCartItem(product.id, 0);
      await this.showToast('Pesanan berhasil dibuat.');
      await this.router.navigate(['/order-report']);
      await this.loadCartItems();
    } catch (error) {
      console.error('Error processing order:', error);
      await this.showToast('Gagal memproses pesanan.');
    }
  }

  async loadCartItems() {
    try {
      this.authService.getCartItems(this.currentUserId).subscribe(
        (cartItems: any[]) => {
          this.cartCount = cartItems.length;
        },
        (error) => {
          console.error('Error loading cart items:', error);
          this.showToast('Gagal memuat data keranjang.');
          this.cartCount = 0;
        }
      );
    } catch (error) {
      console.error('Error loading cart items:', error);
      this.showToast('Gagal memuat data keranjang.');
      this.cartCount = 0;
    }
  }

  increaseQuantity(product: any) {
    if (!product.quantity) {
      product.quantity = 0;
    }
    product.quantity++;
    this.authService.updateCartItem(product.id, product.quantity)
      .then(() => this.updateCartCount())
      .catch(error => console.error('Error updating cart item:', error));
  }

  decreaseQuantity(product: any) {
    if (product.quantity > 0) {
      product.quantity--;
      this.authService.updateCartItem(product.id, product.quantity)
        .then(() => this.updateCartCount())
        .catch(error => console.error('Error updating cart item:', error));
    }
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      cssClass: 'toast-wrapper'
    });
    await toast.present();
  }

  async reduceProductStock(product: any) {
      try {
        // Assuming you have a method in authService to update the product stock
        const newStock = product.stock - 1; // Reduce stock by 1 or any other quantity

        if (newStock < 0) {
          await this.showToast('Stok produk tidak mencukupi.');
          return;
        }

        await this.authService.updateProductStock(product.id, newStock);
      } catch (error) {
        await this.showToast('Gagal mengurangi stok produk.');
      }
    }
}
