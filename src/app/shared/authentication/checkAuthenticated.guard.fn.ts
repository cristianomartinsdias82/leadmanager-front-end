import { inject } from "@angular/core";
import { AuthenticationService } from "./authentication.service";
import { CanActivateFn } from "@angular/router";

export function checkAuthenticated(): CanActivateFn {
    return () => inject(AuthenticationService).isAuthenticated();
}