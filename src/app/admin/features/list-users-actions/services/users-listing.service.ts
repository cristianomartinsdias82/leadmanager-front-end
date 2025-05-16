import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { ApplicationResponse } from 'src/app/shared/core/api-response/application-response';
import { PagedList } from 'src/app/shared/core/pagination/paged-list';
import { User } from "../models/user";

@Injectable({providedIn:'root'})
export class UsersListingService {
    constructor(private httpClient: HttpClient) {}

    private static Endpoint = "users";

    private usersListSubscription = new BehaviorSubject<User[]>([]);
    usersList$ = this.usersListSubscription.asObservable();

    getUsersList() {
      return this.usersListSubscription.getValue();
    }

    load() {
      this.httpClient
            .get<ApplicationResponse<PagedList<User>>>(`${environment.apiUrl}/${UsersListingService.Endpoint}`)
            .subscribe((appResponse: ApplicationResponse<PagedList<User>>) => this.usersListSubscription.next(appResponse.data!.items));
    }
}