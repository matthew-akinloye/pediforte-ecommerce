import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart/cart.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems$!: Observable<any[]>;

  constructor(private router: Router, private cartService: CartService) { }

  ngOnInit(): void {
    this.cartItems$ = this.cartService.getCartItems();
  }

  removeFromCart(item: any) {
    this.cartService.removeFromCart(item);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  checkout() {
    this.cartService.checkout().then((orderData) => {
      if (orderData) {
        console.log('Order data for payment:', orderData);
        this.cartService.setOrderData(orderData);
        this.router.navigate(['/pay']);
      }
    }).catch(error => {
      console.error('Error during checkout:', error);
    });
  }

  calculateGrandTotal(cartItems: any[] | null): number {
    if (!cartItems) {
      return 0;
    }
    return cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  }
}
