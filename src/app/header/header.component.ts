import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { CartService } from '../services/cart/cart.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isAdmin$!: Observable<boolean>;
  cartItemCount = 0;

  constructor(private authService: AuthService, private cartService: CartService) {}

  ngOnInit(): void {
    this.isAdmin$ = this.authService.isAdmin();

    this.cartService.getCartItems().subscribe(items => {
      this.cartItemCount = items.length;
    });
  
  }

}