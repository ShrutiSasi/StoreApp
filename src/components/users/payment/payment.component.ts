import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CartsService } from '../../../services/carts.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent{
  router = inject(Router);
  cartService = inject(CartsService);
  totalPrice = this.cartService.totalPrice(); 
}
