import { inject } from "@angular/core";
import { CanMatchFn, RedirectCommand, Router } from "@angular/router";
import { AuthService } from "./auth.service";

export const authGuard: CanMatchFn = (): boolean |
RedirectCommand =>{
    const authService = inject(AuthService);
    const router = inject(Router);

    if(authService.isLoggedIn$){
        return true;
    }
    return new RedirectCommand(router.parseUrl('/login'));
}