import { Injectable } from "@angular/core";
import { BehaviorSubject, firstValueFrom, map } from "rxjs";
import { OidcSecurityService } from "angular-auth-oidc-client";
import { AuditService } from "../auditing/audit.service";
import { jwtDecode } from "jwt-decode";
import { SessionUserData } from "../jwt/session-user-data";
import { ExtendedJwtPayload } from "../jwt/extended-jwt-payload";
import { Roles } from "../roles";

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

    private userRoles = new BehaviorSubject<Roles[] | null>(null);

    public userIsInAdminRole$ = this.userRoles
                                        .asObservable()
                                        .pipe(
                                            map(userRoles => userRoles !== null
                                                    ? userRoles.some(role => role === Roles.Administrators)
                                                    : false)
                                        );

    initializeAuthFlow() {
        this.oidcSecurityService
                .checkAuth()
                .subscribe(loginResponse => {

                    const { email, sub, role } = jwtDecode(loginResponse.accessToken) as ExtendedJwtPayload;
                    
                    this.onUserOnline.next(true);

                    this.sessionUserData.next({id: sub!, email, role, ldm:[]});
                    this.userRoles.next([role! as Roles]);
                    
                    this.auditService.logUserLoggedInEntry();

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

    async getUserData() {
        return await firstValueFrom(
                        this.oidcSecurityService
                            .getUserData()) as SessionUserData;
    }

    async checkUserMembership(...roles: Roles[]) {
        const userData = await this.getUserData();

        this.userRoles.next(userData && userData.role !== null ? [userData.role! as Roles] : null);

        if (userData === null || !userData.role)
            return false;

        return roles.some(role => role === userData.role);
    }
}
