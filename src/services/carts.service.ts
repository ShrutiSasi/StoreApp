import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Cart } from '../models/cart';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Product } from '../models/product';
import { User } from '../models/user';

@Injectable({
    providedIn: 'root',
})
export class CartsService {
    http = inject(HttpClient);
    apiUrl = 'https://fakestoreapi.com/carts';

    private cartItems = new BehaviorSubject<any[]>(this.getCartFromLocalStorage());
    cartItems$ = this.cartItems.asObservable();  
    totalPrice = signal(this.getTotalPrice());  
    totalItems = signal(this.getTotalItems());

    // Get cart items from local storage
    private getCartFromLocalStorage(): any[] {
        return JSON.parse(localStorage.getItem('cart') || '[]');
        //this.totalItems.set(this.getTotalItems());
    }

    // Save cart items to local storage
    private saveCartToLocalStorage(cart: any[]) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Add product to cart
    addToCart(cartid: number|null, product: any) {        
        const currentCart = this.cartItems.value;
        const existingItem = currentCart.find((item) => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            product.quantity = 1;
            currentCart.push(product);
        }
        this.cartItems.next([...currentCart]);
        this.saveCartToLocalStorage(currentCart);
        this.totalItems.set(this.getTotalItems());
        if(cartid){
            this.updateUserCartIfLoggedIn(cartid);
        }
    }
   
    // Get all cart items
    // getCartItems() {
    //     return this.cartItems.value;
    // }

    // Remove product from cart
    removeFromCart(cartid: number, product: any) {
        const currentCart = this.cartItems.value;
        const existingItem = currentCart.find((item) => item.id === product.id);
        let index= -1;
        if (existingItem) {
            index = currentCart.indexOf(existingItem);
            if(existingItem.quantity > 0){
                existingItem.quantity -= 1;
            }else{
                this.cartItems.next(currentCart.filter((item) => item.id !== product.id));
            }
        }
        // else{
        //     product.quantity = 0;            
        //     currentCart.splice(index, 1);
        // }
        this.saveCartToLocalStorage(this.cartItems.value);
        this.totalItems.set(this.getTotalItems());
        this.updateUserCartIfLoggedIn(cartid);
        //this.cartItems.next([...currentCart]);
        //this.saveCartToLocalStorage(currentCart);
        /*let cart = this.getCartFromLocalStorage();
        cart = cart.filter(item => item.id !== productId);
        this.cartItems.next(cart);
        localStorage.setItem('cart', JSON.stringify(cart));*/
    }
    
    // Clear entire cart
    clearCart(cartid: number) {
        this.cartItems.next([]);
        localStorage.removeItem('cart'); 
        this.totalItems.set(0);
        this.updateUserCartIfLoggedIn(cartid);
    }

    // Restore user's cart after login
    restoreCartFromUser(userCart: any[]) {
        console.log('Restoring cart from user:', userCart);
        this.cartItems.next(userCart);
        this.totalItems.set(this.getTotalItems());
        this.saveCartToLocalStorage(userCart);
    }

     // Calculate Total Price
    getTotalPrice(): number {
        return this.cartItems.value.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    getTotalItems(): number {
        return this.cartItems.value.reduce((total, item) => total + item.quantity, 0);
      }

    getCartByUserId(userId: number): Observable<Cart[]> {
        const cart$ = this.http
                            .get<Cart[]>(this.apiUrl)
                            .pipe(
                                map((carts: Cart[]) => carts.filter(cart => cart.userId === userId))
                            );
        return cart$;
    }

    // Update the cart using cartId
    updateCart(cartId: number, updatedCart: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${cartId}`, updatedCart);
    }

    private updateUserCartIfLoggedIn(cartid: number) {
        const storedData = localStorage.getItem('user');
        if (storedData) {
          const user = JSON.parse(storedData) as User;
          const cartData = {
            userId: user.id,
            date: new Date().toISOString().split('T')[0],
            products: this.cartItems.value.map((item) => ({ productId: item.id, quantity: item.quantity }))
          };
          //this.http.put(`${this.apiUrl}/${user.id}`, cartData).subscribe();
          // Send PUT request to update the cart
            this.updateCart(cartid, cartData).subscribe({next: (response) => {
                console.log("Cart updated successfully:", response);
            }, error: (error) => {
                console.error("Error updating cart:", error);}
            });
        }
    }

}
