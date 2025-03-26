import { Component, inject} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToggleDirective } from './toggle.directive';
import { AuthService } from '../../../../services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { CartsService } from '../../../../services/carts.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [RouterLink, RouterLinkActive, ToggleDirective],
})
export class NavbarComponent{
  router = inject(Router);
  authService = inject(AuthService);
  cartService = inject(CartsService);
  isLoggedIn$ = toSignal(this.authService.isLoggedIn$);
  
  logout(){
    this.authService.logout();    
    // Wait for logout completion before navigating
    setTimeout(() => {
      this.router.navigate(['/login']);//this.#loggedIn.set(false);
    }, 100); 
  }
}
