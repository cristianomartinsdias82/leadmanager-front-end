import { Injectable } from "@angular/core";
import { Subject, tap } from "rxjs";
import { OidcSecurityService } from "angular-auth-oidc-client";

@Injectable({ providedIn:'root' })
export class AuthenticationService {

    constructor(private oidcSecurityService: OidcSecurityService) {}

    private onUserOnline = new Subject<boolean>();
    public userIsOnline$ = this.onUserOnline.asObservable();
    public userIsAuthenticated$ = this.oidcSecurityService.isAuthenticated$;

    initializeAuthFlow() {
        this.oidcSecurityService
        .checkAuth()
        .subscribe(_ => this.onUserOnline.next(true));
    }

    logout() {
        this.oidcSecurityService
        .logoff()
        .subscribe(_ => this.onUserOnline.next(false));
    }

    checkUserIsAuthenticated() {
        this.oidcSecurityService
                .isAuthenticated()
                .subscribe(isAuth => {
                    if (isAuth) {
                        this.onUserOnline.next(true);
                    }
        });
    }
}
