import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product/product.service';
import { CartService } from '../services/cart/cart.service';
import { Observable } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { Product } from '../product.model'; // Adjust the path if needed


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products$!: Observable<Product[]>;


  constructor(private productService: ProductService, private cartService: CartService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.products$ = this.productService.getProducts();
    this.products$.subscribe(products => {
      console.log('Products in component:', products);  // Check if products are received correctly
    });
  }

  addToCart(product: Product): void {
    console.log('Adding to cart:', product);
    this.cartService.addToCart(product);
  }

  openImageModal(imageUrl: string): void {
    this.dialog.open(DialogComponent, {
      data: { imageUrl }
    });
  }
}
