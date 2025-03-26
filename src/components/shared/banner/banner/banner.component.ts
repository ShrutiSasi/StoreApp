import { Component, inject} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
})
export class BannerComponent{
  //programmatic navigation
  router = inject(Router);

  goToShop(){
    this.router.navigate(['/shop']);
  }

}
