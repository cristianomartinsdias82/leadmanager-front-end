import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { OidcSecurityService } from "angular-auth-oidc-client";
import { AuditService } from "../auditing/audit.service";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface ExtendedJwtPayload extends JwtPayload {
    email: string
}

export interface SessionUserData {
    id: string
    email: string
}

@Injectable({ providedIn:'root' })
export class AuthenticationService {

    constructor(
        private oidcSecurityService: OidcSecurityService,
        private auditService: AuditService) {}

    private onUserOnline = new BehaviorSubject<boolean>(false);
    public userIsOnline$ = this.onUserOnline.asObservable();

    private sessionUserData = new BehaviorSubject<SessionUserData | null>(null);
    public sessionUserData$ = this.sessionUserData.asObservable();

    public userIsAuthenticated$ = this.oidcSecurityService.isAuthenticated$;

    initializeAuthFlow() {
        this.oidcSecurityService
        .checkAuth()
        .subscribe(loginResponse => {

            const { email, sub } = jwtDecode(loginResponse.accessToken) as ExtendedJwtPayload;
            
            this.onUserOnline.next(true);
            this.auditService.logUserLoggedInEntry();
            this.sessionUserData.next({id: sub!, email});
            
        });
    }

    logout() {
        this.oidcSecurityService
        .logoff()
        .subscribe(_ => {
            this.onUserOnline.next(false);
            this.sessionUserData.next(null);
        });
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
