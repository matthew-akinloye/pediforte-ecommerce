import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage'; // Import for file storage

import { Product } from '../../product.model';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit {
  products$!: Observable<Product[]>;
  newProduct: Product = { name: '', description: '', price: 0 , createdAt: new Date().toISOString() };
  updatedProduct: Product = { name: '', description: '', price: 0 };
  selectedFiles: File[] = [];
  maxFiles = 8;
  createdAt?: string;
  selectedProductId!: string;


  constructor(
    private productService: ProductService,
    private storage: AngularFireStorage // Inject AngularFireStorage
  ) { }

  ngOnInit(): void {
    this.products$ = this.productService.getProducts();
  }


  addProduct() {
    if (this.newProduct.name && this.newProduct.description && this.newProduct.price) {
      if (this.selectedFiles.length > 0) {
        this.uploadFiles(this.selectedFiles).then(imageUrls => {
          this.newProduct.images = imageUrls;
          this.productService.addProduct(this.newProduct).then(docId => {
            this.newProduct.id = docId; // Set the ID of the new product
            this.newProduct = { name: '', description: '', price: 0, createdAt: new Date().toISOString() }; // Clear the form after adding
            this.selectedFiles = []; // Clear selected files
            alert('Product added successfully!');
          }).catch(error => {
            console.error('Error adding product:', error);
            alert('Failed to add product. Please try again.');
          });
        }).catch(error => {
          console.error('Error uploading files:', error);
          alert('Failed to upload files. Please try again.');
        });
      } else {
        this.productService.addProduct(this.newProduct).then(docId => {
          this.newProduct.id = docId; // Set the ID of the new product
          this.newProduct = { name: '', description: '', price: 0, createdAt: new Date().toISOString() }; // Clear the form after adding
          alert('Product added successfully!');
        }).catch(error => {
          console.error('Error adding product:', error);
          alert('Failed to add product. Please try again.');
        });
      }
    } else {
      alert('Please fill out all required fields.');
    }
  }
  
  
  
  updateProduct() {
    if (this.selectedProductId && this.updatedProduct.name && this.updatedProduct.description && this.updatedProduct.price) {
      if (this.selectedFiles.length > 0) {
        this.uploadFiles(this.selectedFiles).then(imageUrls => {
          this.updatedProduct.images = imageUrls;
          this.productService.updateProduct(this.selectedProductId, this.updatedProduct).then(() => {
            this.updatedProduct = { name: '', description: '', price: 0, images: [] };
            this.selectedFiles = [];
            alert('Product updated successfully!');
          }).catch(error => {
            console.error('Error updating product:', error);
            alert('Failed to update product. Please try again.');
          });
        }).catch(error => {
          console.error('Error uploading files:', error);
          alert('Failed to upload files. Please try again.');
        });
      } else {
        this.productService.updateProduct(this.selectedProductId, this.updatedProduct).then(() => {
          this.updatedProduct = { name: '', description: '', price: 0, images: [] };
          alert('Product updated successfully!');
        }).catch(error => {
          console.error('Error updating product:', error);
          alert('Failed to update product. Please try again.');
        });
      }
    } else {
      alert('Please select a product to update and fill out all required fields.');
    }
  }
  
  
  deleteProduct(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).then(() => {
        alert('Product deleted successfully!');
      }).catch(error => {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      });
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      if (files.length > this.maxFiles) {
        alert(`You can upload a maximum of ${this.maxFiles} images.`);
        return;
      }
      this.selectedFiles = files;
    }
  }

  private uploadFiles(files: File[]): Promise<string[]> {
    const uploadPromises = files.map(file => {
      const filePath = `product-images/${new Date().getTime()}_${file.name}`;
      const fileRef = this.storage.ref(filePath);
      return fileRef.put(file).then(() => fileRef.getDownloadURL().toPromise());
    });
    return Promise.all(uploadPromises);
  }

  selectProduct(product: Product) {
    this.updatedProduct = { ...product };
    this.selectedProductId = product.id!; // Assuming the product has an 'id' field
  }
  

}
