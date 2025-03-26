import { Component } from '@angular/core';
import { BannerComponent } from '../shared/banner/banner/banner.component';
import { AllproductsComponent } from '../products/allproducts/allproducts.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [BannerComponent, AllproductsComponent],
})
export class HomeComponent {

}
