import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Product } from '../../product.model'; // Adjust path as needed
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsCollection: AngularFirestoreCollection<Product>;

  constructor(private firestore: AngularFirestore) {
    this.productsCollection = this.firestore.collection<Product>('products');
  }

  getProducts(): Observable<Product[]> {
    return this.productsCollection.valueChanges({ idField: 'id' }); // Ensure ID is included in the product objects
  }

  addProduct(product: Product): Promise<string> {
    // Create a new document reference with an auto-generated ID
    const newProductRef = this.productsCollection.doc(); // Creates a reference with an auto-generated ID
    const productId = newProductRef.ref.id; // Access the document ID
  
    // Add the ID to the product object
    const productWithId = { ...product, id: productId };
  
    // Set the product document in Firestore
    return newProductRef.set(productWithId).then(() => productId); // Return the document ID
  }
  

  updateProduct(id: string, product: Product): Promise<void> {
    return this.productsCollection.doc(id).update(product);
  }

  deleteProduct(id: string): Promise<void> {
    return this.productsCollection.doc(id).delete();
  }
}
