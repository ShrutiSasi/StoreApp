import { Component, inject, Signal, signal} from '@angular/core';
import { User } from '../../../models/user';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [CommonModule],
})
export class ProfileComponent{
  title= "profile";
  router = inject(Router);
  loggedInUser!: User ;

  ngOnInit(){
    const storedData = localStorage.getItem('user');
    if(storedData){
      this.loggedInUser = JSON.parse(storedData) as User;
    }else {
      this.router.navigate(['/login']);
    }
  }  

}
