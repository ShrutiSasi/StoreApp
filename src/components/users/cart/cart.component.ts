import { Component, inject, Input, signal } from '@angular/core';
import { CartsService } from '../../../services/carts.service';
import { Product } from '../../../models/product';
import { CardComponent } from '../../shared/card/card.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ScrollupComponent } from "../../shared/scrollup/scrollup.component";
import { User } from '../../../models/user';
import { ProductsService } from '../../../services/products.service';
import { filter, forkJoin, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  imports: [CardComponent, CommonModule, ScrollupComponent],
})
export class CartComponent{
  @Input() product!: Product;
  cartItems: any[] = [];
  apiProduct: any;
  totalPrice = signal(0);
  router = inject(Router);
  cartService = inject(CartsService);
  productService = inject(ProductsService);
  authService = inject(AuthService);
  isLoggedIn$ = toSignal(this.authService.isLoggedIn$);
  loggedInUser: User | null = null;
  
  ngOnInit() {
    const storedData = localStorage.getItem('user');
    if(storedData){
      this.loggedInUser = JSON.parse(storedData) as User;
      this.loadCart();
    }
    else {
      this.loadLocalCart();
    }
    // this.cartService.cartItems$.subscribe(items => {
    //   this.cartItems = items;
    //   this.totalPrice.set(this.cartService.getTotalPrice());
    // });
  }

  private loadCart() {
    if (this.loggedInUser) {
      // this.cartService.getCartByUserId(this.loggedInUser.id).subscribe((cart) => {
      //   if (cart.length > 0) {
      //     for (let i = 0; i < cart[0].products.length; i++) {
      //       this.apiProduct = this.productService.getProductById(cart[0].products[i].productId).subscribe(product => {this.product = product;});
      //       this.apiProduct.quantity = cart[0].products[i].quantity;
      //       this.cartItems.push(this.apiProduct);
      //     }
      //     //this.cartItems = cart[0].products;
      //     this.cartService.restoreCartFromUser(this.cartItems);
      //   }
      //   this.totalPrice.set(this.cartService.getTotalPrice());
      // });
      this.cartService.getCartByUserId(this.loggedInUser.id).pipe(
        filter(cart => cart.length > 0), // Ensure cart exists
        switchMap(cart => {
          // Get all product requests as an array of Observables
          const productRequests = cart[0].products.map(productItem => 
            this.productService.getProductById(productItem.productId).pipe(
              map(product => ({ ...product, quantity: productItem.quantity })) // Add quantity to product object
            )
          );
      
          // Use forkJoin to wait for all API requests to complete
          return forkJoin(productRequests);
        })
      )
      .subscribe(products => {
        this.cartItems = products;
        this.cartService.restoreCartFromUser(this.cartItems);        
        this.totalPrice.set(this.cartService.getTotalPrice());
      });
      
    }
  }

  private loadLocalCart() {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
      this.totalPrice.set(this.cartService.getTotalPrice());
    });
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
    this.totalPrice.set(this.cartService.getTotalPrice());
  }
  
  removeFromCart(product: Product) {
    this.cartService.removeFromCart(product);
    this.totalPrice.set(this.cartService.getTotalPrice());
  }

  clearCart() {
    this.cartService.clearCart();
    this.totalPrice.set(0);
  }

  proceedToPay(){
    // const storedData = localStorage.getItem('user');
    //     if(storedData){
    //       this.loggedInUser = JSON.parse(storedData) as User;
    //     }else {
    //       this.router.navigate(['/login']);
    //     }
    if(this.isLoggedIn$()){
      this.router.navigate(['/payment']);
    }else{
      this.router.navigate(['/login']);
    }
  }
}
