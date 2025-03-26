import { Routes } from '@angular/router';
import { AllproductsComponent } from '../components/products/allproducts/allproducts.component';
import { LoginComponent } from '../components/users/login/login.component';
import { DetailsComponent } from '../components/products/details/details.component';
import { CartComponent } from '../components/users/cart/cart.component';
import { HomeComponent } from '../components/home/home.component';
import { NotfoundComponent } from '../components/shared/notfound/notfound.component';
import { DashboardComponent } from '../components/users/dashboard/dashboard.component';
import { AddProductComponent } from '../components/users/addProduct/addProduct.component';
import { authGuard } from '../services/auth.guard';
import { PaymentComponent } from '../components/users/payment/payment.component';
import { ProfileComponent } from '../components/users/profile/profile.component';

export const routes: Routes = [
    {path: '', pathMatch: 'full', component: HomeComponent},
    {path: 'shop', component: AllproductsComponent},
    {path: 'login', component: LoginComponent},
    {path: 'product/:id', 
        //loadComponent: () => import('../components/products/details/details.component').then(mod => mod.DetailsComponent),
        component: DetailsComponent
    },
    {path: 'cart', component: CartComponent},
    {path: 'payment', component: PaymentComponent},
    {path: 'profile', component: ProfileComponent},
    {path: 'newproduct', canMatch:[authGuard], component: AddProductComponent},
    {path: 'dashboard', canMatch:[authGuard], component: DashboardComponent},
    {path: '**', component: NotfoundComponent}
];
