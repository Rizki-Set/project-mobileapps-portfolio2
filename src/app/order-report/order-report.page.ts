import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-order-report',
  templateUrl: './order-report.page.html',
  styleUrls: ['./order-report.page.scss'],
})
export class OrderReportPage implements OnInit {
  orders: any[] = [];
  currentUserId: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  async loadOrders() {
    try {
      const currentUser = await this.authService.getCurrentUser();
      if (currentUser) {
        this.currentUserId = currentUser.uid;

        // Fetch orders and associated product data
        this.authService.getOrdersByUserId(this.currentUserId).subscribe(
          async (ordersSnapshot: any[]) => {
            const ordersList = [];

            for (let orderData of ordersSnapshot) {
              try {
                // Fetch product data by ID to get the price
                const product = await this.authService.getProductById(orderData.productId).pipe(take(1)).toPromise();
                orderData.productName = product ? product.name : 'Unknown Product';
                orderData.price = product ? product.price : 0; // Fetch the product price from Firestore
                orderData.totalPrice = orderData.quantity * orderData.price; // Calculate total price

                ordersList.push(orderData);
              } catch (error) {
                console.error('Error fetching product details:', error);
              }
            }

            this.orders = ordersList;
          },
          (error) => console.error('Error fetching orders:', error)
        );
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  }

  increaseQuantity(order: any) {
    order.quantity += 1;
    order.totalPrice = order.quantity * order.price;  // Recalculate total price
  }

  decreaseQuantity(order: any) {
    if (order.quantity > 1) {
      order.quantity -= 1;
      order.totalPrice = order.quantity * order.price;  // Recalculate total price
    }
  }

  async payOrder(order: any) {
    try {
      // Update the order status to 'success' in Firestore
      order.status = 'success';
      await this.authService.updateOrderStatus(order.id, 'success', order.quantity, order.totalPrice);

      this.showToast('Your payment was successful.');

      // Reload orders to refresh the status and UI
      this.loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: 'success',
      position: 'top'
    });
    await toast.present();
  }
}
