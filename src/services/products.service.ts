import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom, map, Observable } from 'rxjs';
import { Product } from '../models/product';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
    providedIn: 'root',
})
export class ProductsService {
    http = inject(HttpClient);
    apiUrl = 'https://fakestoreapi.com/products';
    
    getAllProducts(): Observable<Product[]>{
        const products$ = this.http
                                .get<Product[]>(this.apiUrl);   
        return products$;
    }

    getProductById(id: number): Observable<any>{
        const product$ = this.http
                                .get<Product[]>(this.apiUrl)
                                .pipe(
                                    map((products: Product[]) => products.find(product => product.id === id))
                                ); 
        return product$;
    }

    async generateProductId(): Promise<number>{
        const products = await firstValueFrom(this.http.get<Product[]>(this.apiUrl));
        if (products.length === 0) {
            return 1; // Start from 1 if there are no products
        }
        const lastProductId = products[products.length - 1].id;
        return lastProductId + 1;
    }

    addProduct(product: Product) {
        console.log(product);
        const product$ = this.http
                                .post<Product>(this.apiUrl, product);
        return product$;      
    }
}
