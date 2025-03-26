import { Component, inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Product } from '../../../models/product';
import { ProductsService } from '../../../services/products.service';
import { AlertComponent } from '../../shared/alert/alert.component';
import { User } from '../../../models/user';

@Component({
  selector: 'app-addProduct',
  templateUrl: './addProduct.component.html',
  styleUrls: ['./addProduct.component.css'],
  imports: [ReactiveFormsModule, AlertComponent],
})
export class AddProductComponent{
  title = 'newproduct';
  router = inject(Router);
  authService = inject(AuthService);
  isLoggedIn$ = toSignal(this.authService.isLoggedIn$);
  productsService = inject(ProductsService);
  @ViewChild(AlertComponent) alertBox!: AlertComponent;
  errorMessage = '';
  loggedInUser!: User ;
  
  ngOnInit(){
    const storedData = localStorage.getItem('user');
      if(storedData){
        this.loggedInUser = JSON.parse(storedData) as User;
      }else {
        this.router.navigate(['/login']);
      }
  }

  //Reactive Forms
  categories: string[] = ["electronics", "jewelery", "men's clothing","women's clothing","others"];
  selectedCategory = new FormControl('', Validators.required);
  imagePreview: string | ArrayBuffer | null = null;
  fileError: string | null = null;

  addProductForm = new FormGroup({
    title: new FormControl(null, [Validators.required]),
    price: new FormControl(null, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]),
    description: new FormControl(''),
    category: this.selectedCategory,    
    image: new FormControl(''),
    rating: new FormGroup({      
      count: new FormControl(null, [Validators.pattern('^[0-9]\d*$')])
    })
  });

  get productNameEmpty(){
    const productNameRef = this.addProductForm.controls['title'];
    return !productNameRef.value && productNameRef.touched;
  }
  get productPriceEmpty(){
    const productPriceRef = this.addProductForm.controls['price'];
    return !productPriceRef.value && productPriceRef.touched;
  }
  get productPriceValid(){
    const productPriceRef = this.addProductForm.controls['price'];
    return productPriceRef.value && !productPriceRef.valid;
  }
  get productCategoryValid(){
    const productCategoryRef = this.addProductForm.controls['category'];
    return productCategoryRef.value === "" && productCategoryRef.touched;
  }
  get productCountValid(){
    const productCountRef = this.addProductForm.controls['rating'].controls['count'];
    return productCountRef?.value && !productCountRef?.valid;
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
     // Validate File Type
     const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (file) {
      if (!allowedTypes.includes(file.type)) {
        this.fileError = 'Only JPG, PNG images are allowed.';
        this.imagePreview = null;
        return;
      }
      this.fileError = null;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result; // Convert file to base64 string
      };
      reader.readAsDataURL(file);
    }
  }

  async onSubmit(){    
    if(this.addProductForm.invalid){
      this.errorMessage = 'Invalid product. Please provide the required details.';
    }else{
      const newProduct: Product = {
        id: await this.productsService.generateProductId(), // Generate an ID for the new product
        title: this.addProductForm.value.title ?? '', 
        price: this.addProductForm.value.price ?? 0, 
        description: this.addProductForm.value.description ?? '',
        category: this.addProductForm.value.category ?? '',
        image: this.addProductForm.value.image ?? '',
        rating: {
          rate: 0,
          count: this.addProductForm.value.rating?.count ?? 0, 
        },
      };
      this.errorMessage = '';
      this.productsService.addProduct(newProduct);
      this.alertBox.message = "New product added";
      this.alertBox.openModal();
    }    
  }
}
