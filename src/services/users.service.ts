import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../models/user';
import { map, of, switchMap, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UsersService {
    http = inject(HttpClient);
    apiUrl = 'https://fakestoreapi.com/users';
   
    getAllUsers() {
        const users$ = this.http
                            .get<User[]>(this.apiUrl);                            
        return users$;
    }

    getLoggedInUser(useremail: string) {
        console.log(useremail);
        return this.http
                            .get<User[]>(this.apiUrl)
                            .pipe(
                                map(users => {const user = users.find(user => user.email.toLowerCase().trim() === useremail.toLowerCase().trim())
                                    if(user){
                                        return user;
                                    }
                                    return null;
                                })
                            );
    }
    
}
