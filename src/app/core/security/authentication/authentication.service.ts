import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject, of, tap } from "rxjs";
import { OidcSecurityService } from "angular-auth-oidc-client";
import { AuditService } from "../auditing/audit.service";

@Injectable({ providedIn:'root' })
export class AuthenticationService {

    constructor(
        private oidcSecurityService: OidcSecurityService,
        private auditService: AuditService) {}

    private onUserOnline = new BehaviorSubject<boolean>(false);
    public userIsOnline$ = this.onUserOnline.asObservable();

    public userIsAuthenticated$ = this.oidcSecurityService.isAuthenticated$;

    initializeAuthFlow() {
        this.oidcSecurityService
        .checkAuth()
        .subscribe(_ => {
            this.onUserOnline.next(true);
            this.auditService.logUserLoggedInEntry();
        });
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
