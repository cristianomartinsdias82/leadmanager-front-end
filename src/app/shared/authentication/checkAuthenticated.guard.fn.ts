import { inject } from "@angular/core";
import { AuthenticationService } from "./authentication.service";
import { CanActivateFn } from "@angular/router";

export function checkAuthenticated(): CanActivateFn {
    return () => {
        
        //Temporarily commented out
        // const authService = inject(AuthenticationService);

        // if (!authService.isAuthenticated()) {
        //     authService.redirectToLoginView();
        // }

        return true;
    };
}