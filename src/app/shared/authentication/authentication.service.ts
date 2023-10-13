import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, Subject, of } from "rxjs";
import { Router } from "@angular/router";

@Injectable({ providedIn:'root' })
export class AuthenticationService {

    constructor(
        private httpClient: HttpClient,
        private router: Router) {}

    private userAuthenticationSuccessful = new BehaviorSubject<{}>({});
    public onUserAuthenticationSuccessful$ = this.userAuthenticationSuccessful.asObservable();

    private userIsAuthenticated = new BehaviorSubject<boolean>(false);
    public userIsAuthenticated$ = this.userIsAuthenticated.asObservable();

    private userLoggedOut = new Subject<unknown>();
    public onUserLoggedOut$ = this.userLoggedOut.asObservable();

    isAuthenticated(): boolean {

        //To be continued...
        console.log(this.userIsAuthenticated.getValue());

        return this.userIsAuthenticated.getValue();
    }

    logout() {

        //To be continued...
        this.userLoggedOut.next(null);
        this.userIsAuthenticated.next(false);
    }
}
