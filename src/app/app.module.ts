import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { FormsModule } from '@angular/forms';
import { environment } from '../environments/environment'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { UserComponent } from './user/user.component';
import { CartComponent } from './cart/cart.component';
import { ProductsComponent } from './products/products.component';
import { AdminUserComponent } from './admin/admin-user/admin-user.component';
import { AdminProductsComponent } from './admin/admin-products/admin-products.component';
import { AdminComponent } from './admin/admin/admin.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';

import { ProductService } from './services/product/product.service';
import { CartService } from './services/cart/cart.service';
import { AuthService } from './services/auth/auth.service';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { HeaderComponent } from './header/header.component';
import { DatePipe } from '@angular/common';
import { PaymentComponent } from './payment/payment.component';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { MatDialogModule } from '@angular/material/dialog';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DialogComponent } from './dialog/dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    SignInComponent,
    UserComponent,
    CartComponent,
    ProductsComponent,
    AdminUserComponent,
    AdminProductsComponent,
    AdminComponent,
    AdminUsersComponent,
    CheckoutComponent,
    OrderHistoryComponent,
    HeaderComponent,
    PaymentComponent,
    DialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    MatDialogModule
  ],
  providers: [ProductService, CartService, AuthService, DatePipe, provideAnimationsAsync()],
  bootstrap: [AppComponent]
})
export class AppModule { }
