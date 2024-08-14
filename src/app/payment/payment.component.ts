import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart/cart.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  order: any;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.orderData$.subscribe(orderData => {
      if (orderData) {
        this.order = orderData;
        console.log('Received order data:', this.order);
      } else {
        console.error('No order data found');
      }
    });
  }
}
