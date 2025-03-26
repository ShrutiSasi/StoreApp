import { Component, inject } from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { Observable } from 'rxjs';
import { User } from '../../../models/user';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule]
})
export class DashboardComponent{
  title = 'dashboard';  
  router = inject(Router);
  users = inject(UsersService);
  loggedInUser!: User ;
  userData$: Observable<User[]> = this.users.getAllUsers();
  registeredUsers = toSignal(this.userData$);

  ngOnInit(){
    const storedData = localStorage.getItem('user');
    if(storedData){
      this.loggedInUser = JSON.parse(storedData) as User;
    }else {
      this.router.navigate(['/login']);
    }
  }  
}
