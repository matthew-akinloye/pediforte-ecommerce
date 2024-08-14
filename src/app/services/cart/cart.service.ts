import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Order } from '../../order';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems$ = new BehaviorSubject<any[]>([]);
  private uid: string | null = null;
  private orderDataSubject = new BehaviorSubject<any>(null);
  orderData$ = this.orderDataSubject.asObservable();




  constructor(private firestore: AngularFirestore, private authService: AuthService) {
    this.authService.user$.subscribe(user => {
      this.uid = user?.uid || null;
      if (this.uid) {
        this.loadCart();
      }
    });
  }

  setOrderData(orderData: any) {
    this.orderDataSubject.next(orderData);
  }

  
  private loadCart() {
    if (this.uid) {
      this.firestore.collection('users').doc(this.uid).collection('cart').doc('items').valueChanges().subscribe(cart => {
        const cartItems = (cart as any)?.items || [];
        this.cartItems$.next(cartItems);
      });
    }
  }


  addToCart(product: any) {
    if (this.uid) {
      this.firestore.collection('users').doc(this.uid).collection('cart').doc('items').get().subscribe(doc => {
        const data = doc.data() as { items: any[] } | undefined;
        const currentItems = data?.items || [];

        const existingProductIndex = currentItems.findIndex(item => item.name === product.name && item.price === product.price);

        if (existingProductIndex > -1) {
          // Update quantity if product already in cart
          currentItems[existingProductIndex].quantity = (currentItems[existingProductIndex].quantity || 1) + 1;
        } else {
          // Add new product to cart
          product.quantity = 1;
          currentItems.push(product);
        }

        this.firestore.collection('users').doc(this.uid as string).collection('cart').doc('items').set({ items: currentItems }).then(() => {
          console.log('Cart updated:', currentItems);
        }).catch(error => {
          console.error('Error updating cart:', error);
        });
      }, error => {
        console.error('Error getting cart document:', error);
      });
    } else {
      console.error('User ID is null.');
    }
  }

  getCartItems(): Observable<any[]> {
    return this.cartItems$.asObservable();
  }

  clearCart() {
    if (this.uid) {
      this.firestore.collection('users').doc(this.uid).collection('cart').doc('items').set({ items: [] }).then(() => {
        console.log('Cart cleared');
      }).catch(error => {
        console.error('Error clearing cart:', error);
      });
    }
  }



  removeFromCart(product: any) {
    if (this.uid) {
      this.firestore.collection('users').doc(this.uid).collection('cart').doc('items').get().subscribe(doc => {
        const data = doc.data() as { items: any[] } | undefined;
        const currentItems = data?.items || [];
        
        const existingProductIndex = currentItems.findIndex(item => item.name === product.name && item.price === product.price);

        if (existingProductIndex > -1) {
          if (currentItems[existingProductIndex].quantity > 1) {
            // Decrease quantity if more than one
            currentItems[existingProductIndex].quantity -= 1;
          } else {
            // Remove product if quantity is 1
            currentItems.splice(existingProductIndex, 1);
          }

          this.firestore.collection('users').doc(this.uid as string).collection('cart').doc('items').set({ items: currentItems }).then(() => {
            console.log('Product removed from cart:', product);
          }).catch(error => {
            console.error('Error removing from cart:', error);
          });
        }
      }, error => {
        console.error('Error getting cart document:', error);
      });
    } else {
      console.error('User ID is null.');
    }
  }

  async checkout(): Promise<any> {
    if (this.uid) {
      try {
        // Get cart items
        const cartDoc = await this.firestore.collection('users').doc(this.uid).collection('cart').doc('items').get().toPromise();
        const cartData = cartDoc?.data() as { items: any[] } | undefined;
        const items = cartData?.items || [];
  
        // Calculate grand total
        const totalAmount = items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  
        // Create a new document reference with auto-generated ID
        const ordersCollection = this.firestore.collection('users').doc(this.uid).collection('orders');
        const newOrderDoc = ordersCollection.doc(); // This creates a reference with an auto-generated ID
        const orderId = newOrderDoc.ref.id; // Access the document ID
  
        // Create order object
        const order = {
          items: items.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity || 1
          })),
          status: 'pending',
          createdAt: new Date().toISOString(), // Store as ISO string
          id: orderId, // Include the generated ID
          totalAmount: totalAmount, // Include total amount
          currency: 'NGN' // Add currency if needed
        };
  
        // Save order to Firestore
        await newOrderDoc.set(order);
  
        // Clear the cart
        await this.firestore.collection('users').doc(this.uid).collection('cart').doc('items').set({ items: [] });
  
        console.log('Order placed successfully:', order);
  
        // Return the order data for further use
        return order;
  
      } catch (error) {
        console.error('Error during checkout:', error);
        throw error; // Re-throw error to be handled by caller
      }
    }
    return null;
  }
  
  
  

  
}
