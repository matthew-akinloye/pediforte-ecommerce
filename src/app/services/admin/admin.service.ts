import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, tap } from 'rxjs';
import { User } from '../../user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private firestore: AngularFirestore) {}

  getUsers(): Observable<User[]> {
    return this.firestore.collection<User>('users').valueChanges({ idField: 'uid' }).pipe(
      tap(users => console.log('Fetched users:', users)) // Log fetched users
    );
  }
  
  getUserDetails(userId: string) {
    return this.firestore.collection('users').doc(userId).valueChanges();
  }

  getOrderHistory(userId: string): Observable<any[]> {
    return this.firestore.collection('users').doc(userId).collection('orders').valueChanges();
  }

  getPaymentHistory(): Observable<any[]> {
    return this.firestore.collection('payments').valueChanges();
  }

  updateProduct(productId: string, product: any) {
    return this.firestore.collection('products').doc(productId).update(product);
  }

  deleteUser(userId: string) {
    return this.firestore.collection('users').doc(userId).delete();
  }

  blockUser(userId: string) {
    return this.firestore.collection('users').doc(userId).update({ blocked: true });
  }

  banUser(userId: string) {
    return this.firestore.collection('users').doc(userId).update({ banned: true });
  }
}
