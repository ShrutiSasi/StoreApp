import { Component, HostListener, inject, Input, signal } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { map, Observable, startWith, switchMap } from 'rxjs';
import { Product } from '../../../models/product';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ScrollupComponent } from '../../shared/scrollup/scrollup.component';

@Component({
  selector: 'app-allproducts',
  templateUrl: './allproducts.component.html',
  styleUrls: ['./allproducts.component.css'],
  imports:[RouterModule, ReactiveFormsModule, CommonModule, ScrollupComponent]
})
export class AllproductsComponent {
  searchControl = new FormControl('');
  router = inject(Router);
  productService = inject(ProductsService);
  productData$!: Observable<Product[]>;
  filteredProducts$!: Observable<Product[]>;
  
  ngOnInit() {
    this.productData$ = this.productService.getAllProducts();      
    this.filteredProducts$ = this.searchControl.valueChanges
                                                .pipe(startWith(''),
                                                  switchMap(searchText => this.filteredProducts(searchText || '')));
  }
  
  private filteredProducts(searchText: string): Observable<Product[]> {
    return this.productData$
                .pipe(map((products: Product[]) => products.filter(product => product.title.toLowerCase().includes(searchText.toLowerCase())))
    )
  }

  goToProductDetails(product: Product){
    this.router.navigate(['/product', product.id]);
  }
}
