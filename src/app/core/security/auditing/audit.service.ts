import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({ providedIn:'root' })
export class AuditService {

    constructor(private httpClient: HttpClient) {}

    logUserLoggedInEntry() {
        this.httpClient
            .post(`${environment.apiUrl}/auditing/logins/log`, null)
            .subscribe();
    }
}