import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Order } from '../../order'; // Adjust the path as necessary

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private firestore: AngularFirestore) {}

  createOrder(userId: string, order: Order) {
    return this.firestore.collection('users').doc(userId).collection('orders').add(order);
  }

  getOrderHistory(userId: string): Observable<Order[]> {
    return this.firestore.collection('users').doc(userId).collection<Order>('orders' , ref =>
      ref.orderBy('createdAt', 'desc')).valueChanges();
  }

  getOrder(userId: string, orderId: string): Observable<Order> {
    return this.firestore.collection('users').doc(userId).collection('orders').doc(orderId).valueChanges() as Observable<Order>;
  }
  
}
