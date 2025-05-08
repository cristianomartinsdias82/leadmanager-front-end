import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { PagingParameters } from 'src/app/shared/core/pagination/paging-parameters';
import { ApplicationResponse } from 'src/app/shared/core/api-response/application-response';
import { PagedList } from 'src/app/shared/core/pagination/paged-list';
import { AuditEntry } from '../models/audit-entry';
import { Query } from "src/app/shared/data-access/query";
import { objectsAtomicallyEqual } from "src/app/shared/objects-atomically-equal";

@Injectable({providedIn:'root'})
export class UsersActionsService {
    constructor(
      private httpClient: HttpClient) {
    }

    private static Endpoint = "auditing";

    private usersActionsDataRetrievalSubscription = new BehaviorSubject<boolean>(true);
    onUsersActionsDataRetrieve$ = this.usersActionsDataRetrievalSubscription.asObservable();

    usersActionsQuerySubscription = new BehaviorSubject<Query>({term:undefined, userId: undefined, startDate: undefined, endDate: undefined});
    usersActionsQuery$ = this.usersActionsQuerySubscription.asObservable();

    onSearch(query: Query) {
      if (!objectsAtomicallyEqual(this.usersActionsQuerySubscription.getValue(), query))
      {
        console.log('Different');
        this.usersActionsQuerySubscription.next(query);
      }
    }

    fetch(query?: Query,
          pagingParameters?: PagingParameters): Observable<ApplicationResponse<PagedList<AuditEntry>>> {
    
            return this.httpClient
                        .get<ApplicationResponse<PagedList<AuditEntry>>>(
                            `${environment.apiUrl}/${UsersActionsService.Endpoint}`,
                            {
                              params: {
                                page: pagingParameters!.pageNumber,
                                pageSize: pagingParameters!.pageSize,
                                sortColumn: pagingParameters!.sortColumn,
                                sortDirection: pagingParameters!.sortDirection,
                                
                                term: query?.term ?? '',
                                startDate: query?.startDate ?? '',
                                endDate: query?.endDate ?? '',
                                userId: query?.userId ?? ''
                              }
                            })
                        .pipe(
                              tap((appResponse: ApplicationResponse<PagedList<AuditEntry>>) => {
                                this.usersActionsDataRetrievalSubscription.next(appResponse.data!.itemCount > 0);
                              })
                            );
      }

      /*
      download(query? Query, format: string) {

        this.httpClient
              .get(`${environment.apiUrl}/${UsersActionsService.Endpoint}/download?format=${format}`,
                   {observe: 'response', responseType: 'blob'})
              .pipe(
                tap((response: HttpResponse<Blob>) => {;

                  const link = document.createElement('a') as HTMLAnchorElement;
                  link.download = response.headers.get('Content-Disposition')?.split(';')[1].split('=')[1]!;
                  link.href = window.URL.createObjectURL(response.body!)
                  link.click();

                })
              )
              .subscribe();

      }
      */
}