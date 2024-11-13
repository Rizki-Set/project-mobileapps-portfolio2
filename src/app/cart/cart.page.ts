  import { Component, OnInit } from '@angular/core';
  import { AuthService } from '../services/auth.service';
  import { ToastController } from '@ionic/angular';

  @Component({
    selector: 'app-cart',
    templateUrl: './cart.page.html',
    styleUrls: ['./cart.page.scss'],
  })
  export class CartPage implements OnInit {
    cartItems: any[] = [];
    totalAmount: number = 0;

    constructor(
      private authService: AuthService,
      private toastController: ToastController
    ) {}

    async ngOnInit() {
      await this.loadCartItems();
    }

async loadCartItems() {
  try {
    const user = await this.authService.getCurrentUser();
    if (user) {
      const userId = user.uid;
      this.authService.getCartItems(userId).subscribe(
        (items: any[]) => {
          console.log('Cart Items from Firestore:', items); // Debugging
          this.cartItems = items ?? [];
          this.calculateTotalAmount();
        },
        (error: any) => {
          console.error('Error loading cart items:', error);
          this.showToast('Gagal memuat keranjang.');
        }
      );
    } else {
      console.error('User not authenticated');
      this.showToast('Pengguna tidak terautentikasi.');
    }
  } catch (error) {
    console.error('Error loading cart items:', error);
    this.showToast('Gagal memuat keranjang.');
  }
}

  imgError(event: Event) {
    const element = event.target as HTMLImageElement;
    console.error('Image loading error:', event);
    console.log('Image src:', element.src);
    element.src = 'assets/img/default-product.jpg'; // ionic servegagal memuat
  }

    calculateTotalAmount() {
      this.totalAmount = this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

// src/app/cart/cart.page.ts

async removeItem(item: any) {
  try {
    const user = await this.authService.getCurrentUser();
    if (user) {
      const userId = user.uid;
      console.log('Removing item:', item.id); // Debugging: Log item ID yang akan dihapus
      await this.authService.removeFromCart(item.id, userId);
      this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== item.id);
      this.calculateTotalAmount();
      this.showToast('Item berhasil dihapus dari keranjang.');
    } else {
      this.showToast('Pengguna tidak terautentikasi.');
    }
  } catch (error) {
    console.error('Error removing item from cart:', error);
    this.showToast('Gagal menghapus item dari keranjang.');
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


  // Implementasi metode checkout
    async checkout() {
      try {
        // Logika checkout di sini (misalnya, navigasi ke halaman checkout atau melakukan proses pembayaran)
        console.log('Checkout method called');
        // Misalnya, navigasi ke halaman checkout:
        // this.router.navigate(['/checkout']);
      } catch (error) {
        console.error('Error during checkout:', error);
        this.showToast('Gagal memproses checkout.');
      }
    }

    getCartItems(): any[] {
    const cartItems = localStorage.getItem('cartItems');
    return cartItems ? JSON.parse(cartItems) : [];
  }
  }
