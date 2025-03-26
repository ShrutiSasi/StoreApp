import { inject, Injectable, signal } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { User } from "../models/user";
import { BehaviorSubject, map } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthService{
    //#loggedIn = signal(false);    
    private loggedIn = new BehaviorSubject<boolean>(this.checkLoginStatus());
    http = inject(HttpClient);
    apiUrl = 'https://fakestoreapi.com/users';

    //isLoggedIn = this.#loggedIn.asReadonly();
    isLoggedIn$ = this.loggedIn.asObservable();

    login(email: string, password: string) {
        const users$ = this.http.get<User[]>(this.apiUrl);
        return users$.pipe(
            map((users) => {
                const user = users.find(user => user.email === email && user.password === password);
                    if(user){
                        localStorage.setItem('user', JSON.stringify(user));
                        this.loggedIn.next(true); // Update the BehaviorSubject
                        //this.#loggedIn.set(true);
                        return true;
                    }
                    //this.#loggedIn.set(false);
                    return false;
                })
            );
    }
    
    logout(){
        localStorage.clear();
        this.loggedIn.next(false); // Update the BehaviorSubject on logout

         // Force UI update if needed
        location.reload(); // to ensure the app resets
    }

    // Check if user is logged in
    private checkLoginStatus(): boolean {
        return localStorage.getItem('user') !== null;
    }
}