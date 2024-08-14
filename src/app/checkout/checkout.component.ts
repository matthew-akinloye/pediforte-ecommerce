import { Component } from '@angular/core';
import { CartService } from '../services/cart/cart.service';
import { OrderService } from '../services/order/order.service';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

import { Order } from '../order';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
  cartItems$ = this.cartService.getCartItems();
  shippingInfo = { address: '', city: '', postalCode: '' };

  constructor(private cartService: CartService, private orderService: OrderService, private router: Router, private authService: AuthService){}


  // checkout() {
  //   this.authService.user$.subscribe(user => {
  //     if (user) {
  //       const newOrder: Order = {
  //         id: this.generateId(), // Generate or assign an ID as needed
  //         items: this.getCartItems(), // Fetch your cart items
  //         shipping: {
  //           address: '123 Main St',
  //           city: 'Anytown',
  //           postalCode: '12345'
  //         },
  //         status: 'pending'
  //       };

  //       this.orderService.createOrder(newOrder).then(() => {
  //         console.log('Order created successfully');
  //       }).catch(error => {
  //         console.error('Error creating order', error);
  //       });
  //     }
  //   });
  // }

  generateId(): string {
    // Generate a unique ID for the order
    return Math.random().toString(36).substr(2, 9);
  }

  getCartItems(): any[] {
    // Fetch and return your cart items
    this.placeOrder()
    return [];
  }


  placeOrder() {
    this.cartItems$.subscribe(cartItems => {
      const order = {
        items: cartItems,
        shipping: this.shippingInfo,
        status: 'Pending'
      };
    });
  }
}
