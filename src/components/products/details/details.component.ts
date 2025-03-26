import { Component, inject, Input, ViewChild } from '@angular/core';
import { Product } from '../../../models/product';
import { CartsService } from '../../../services/carts.service';
import { CardComponent } from '../../shared/card/card.component';
import { RatingComponent } from '../../shared/rating/rating.component';
import { CommonModule } from '@angular/common';
import { AlertComponent } from "../../shared/alert/alert.component";
import { ProductsService } from '../../../services/products.service';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  imports: [CardComponent, RatingComponent, CommonModule, AlertComponent, RouterModule],
})
export class DetailsComponent{
  @ViewChild(AlertComponent) alertBox!: AlertComponent;
  route = inject(ActivatedRoute);
  cartService = inject(CartsService);
  productService = inject(ProductsService);
  product!: Product;

  ngOnInit(){
    const productid = Number(this.route.snapshot.paramMap.get('id')); // Get id from url
    if(productid){
      this.productService.getProductById(productid)
                        .subscribe(product => {this.product = product;});
    }
  }

  addToCart(){
    this.cartService.addToCart(null, this.product);
    this.alertBox.message = "Product added to cart";
    this.alertBox.openModal();
  }
}
