import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { OrderService } from '../services/order/order.service';
import { Observable, switchMap } from 'rxjs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order } from '../order';
import { DatePipe } from '@angular/common';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
  orders$!: Observable<Order[]>;

  constructor(private authService: AuthService, private orderService: OrderService,private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.orders$ = this.authService.user$.pipe(
      switchMap(user => this.orderService.getOrderHistory(user?.uid || ''))
    );
  }

  downloadOrder(orderId: string) {
    this.authService.user$.pipe(
      switchMap(user => this.orderService.getOrder(user?.uid || '', orderId))
    ).subscribe(order => {
  
      if (!order) {
        console.error('Order not found');
        return;
      }
    
      console.log('Fetched order:', order); // Log fetched order
      if (order && order.items) { // Check if order and order.items are defined
        const doc = new jsPDF();
        autoTable(doc, {
          head: [['Product', 'Quantity', 'Price']],
          body: order.items.map(item => [item.name, item.quantity, item.price])
        });
        doc.save(`order_${orderId}.pdf`);
      } else {
        console.error('Order or order items not found:', order);
      }
    }, error => {
      console.error('Error fetching order:', error);
    });
  }
  
  calculateGrandTotal(order: any): number {
    return order.items.reduce((total: number, item: any) => total + (item.price * item.quantity), 0);
  }


  convertTimestampToDate(timestamp: Timestamp | { seconds: number, nanoseconds: number } | undefined): Date | undefined {
    if (!timestamp) return undefined; // Handle undefined

    if (timestamp instanceof Timestamp) {
      return timestamp.toDate();
    } else if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000);
    }
    return undefined; // Fallback if the format is incorrect
  }
}
