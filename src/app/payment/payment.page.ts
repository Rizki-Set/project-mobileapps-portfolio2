import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PaymentResponse } from '../models/new-types';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
  currentUserId: string = '';
  order: any;
  paymentStatus: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Implementasikan logika inisialisasi di sini jika diperlukan
  }

  async orderProduct(product: any) {
    if (!this.currentUserId) {
      await this.showToast('Pengguna tidak terautentikasi.');
      return;
    }

    const order = {
      productId: product.id,
      userId: this.currentUserId,
      orderDate: new Date().toISOString(),
      quantity: 1,
      status: 'pending',
    };

    try {
      // Save the order to the backend
      const orderResponse = await this.authService.saveCustomerOrder(this.currentUserId, order);

      // Create payment intent
      const paymentResponse = await this.authService.createPaymentIntent(orderResponse.id).toPromise() as PaymentResponse;

      if (paymentResponse.redirect_url) {
        // Redirect to payment page
        window.location.href = paymentResponse.redirect_url;
      } else if (paymentResponse.clientSecret) {
        // Handle client secret
        console.log('Client Secret:', paymentResponse.clientSecret);
      } else {
        console.error('Client secret or redirect URL is missing in payment response');
        await this.showToast('Gagal memproses pembayaran.');
      }
    } catch (error) {
      console.error('Error processing order or payment:', error);
      await this.showToast('Gagal memproses pembayaran.');
    }
  }

    async processPayment() {
    // Implementasi logika pemrosesan pembayaran
    this.paymentStatus = 'Payment processing...';
    // Setelah berhasil
    this.paymentStatus = 'Payment successful!';
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      cssClass: 'toast-wrapper'
    });
    await toast.present();
  }
}


