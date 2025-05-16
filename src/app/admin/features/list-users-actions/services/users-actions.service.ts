import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApplicationResponse } from 'src/app/shared/core/api-response/application-response';
import { PagedList } from 'src/app/shared/core/pagination/paged-list';
import { AuditEntry } from '../models/audit-entry';
import { Query } from "src/app/shared/data-access/query";
import { UsersActionsSearchParams } from "../components/users-actions-search/users-actions-search-params";
import { PagingParameters } from "src/app/shared/core/pagination/paging-parameters";
import { SystemActions } from "../models/system-actions";
import { PromptService } from "src/app/shared/ui/widgets/prompt-dialog/prompt.service";
//import { BulkRegistrationActionDataPanelComponentV1 } from "../components/data-panels/bulk-registration-action-data-panel/v1/bulk-registration-action-data-panel.component-v1";
import { BulkRegistrationActionDataPanelComponentV2 } from "../components/data-panels/bulk-registration-action-data-panel/v2/bulk-registration-action-data-panel.component-v2";
import { RegistrationActionDataPanelComponent } from "../components/data-panels/registration-action-data-panel/registration-action-data-panel.component";
import { UpdateActionDataPanelComponent } from "../components/data-panels/update-action-data-panel/update-action-data-panel.component";
import { RemoveActionDataPanelComponent } from "../components/data-panels/remove-action-data-panel/remove-action-data-panel.component";
import { MatDialogRef } from "@angular/material/dialog";

@Injectable({providedIn:'root'})
export class UsersActionsService {
    constructor(
      private httpClient: HttpClient,
      private promptService: PromptService) {}

    private static Endpoint = "auditing";

    private usersActionsDataRetrievalSubscription = new BehaviorSubject<boolean>(true);
    onUsersActionsDataRetrieve$ = this.usersActionsDataRetrievalSubscription.asObservable();

    querySubscription = new BehaviorSubject<Query>({term:'', userId: '', startDate: undefined, endDate: undefined});
    query$ = this.querySubscription.asObservable();

    onSearch(searchParams: UsersActionsSearchParams) {

      const currentQuery = this.querySubscription.getValue();

      this.querySubscription.next({
        pagingParameters: {...currentQuery.pagingParameters} as PagingParameters,
        term: searchParams.term,
        userId: searchParams.userId,
        startDate: searchParams.startDate,
        endDate: searchParams.endDate
      });
    }

    fetch(query?: Query): Observable<ApplicationResponse<PagedList<AuditEntry>>> {
    
            return this.httpClient
                        .get<ApplicationResponse<PagedList<AuditEntry>>>(
                            `${environment.apiUrl}/${UsersActionsService.Endpoint}`,
                            {
                              params: {
                                page: query!.pagingParameters!.pageNumber,
                                pageSize: query!.pagingParameters!.pageSize,
                                sortColumn: query!.pagingParameters!.sortColumn,
                                sortDirection: query!.pagingParameters!.sortDirection,
                                
                                term: query!.term ?? '',
                                startDate:  query!.startDate ? new Date(query!.startDate).toISOString() : '',
                                endDate: query!.endDate ? new Date(query!.endDate).toISOString() : '',
                                userId: query!.userId ?? ''
                              }
                            })
                        .pipe(
                              tap((appResponse: ApplicationResponse<PagedList<AuditEntry>>) => {
                                this.usersActionsDataRetrievalSubscription.next(appResponse.data!.itemCount > 0);
                              })
                        );
      }

      displayUserActionDetails(userAction: AuditEntry) {

        if ([SystemActions.Login, SystemActions.Unknown].indexOf(userAction.action) > 1)
          throw new Error(`There is no action data panel implemented for ${SystemActions.BulkLeadRegistration} option.`)
        
        let dialogRef!: MatDialogRef<any>;
        switch(userAction.action)
        {
          // case SystemActions.BulkLeadRegistration:
          //     dialogRef = this.promptService.openDialog<BulkRegistrationActionDataPanelComponentV1, AuditEntry>(
          //       BulkRegistrationActionDataPanelComponentV1,
          //       userAction,
          //       80);
          //     break;
          case SystemActions.BulkLeadRegistration:
              dialogRef = this.promptService.openDialog<BulkRegistrationActionDataPanelComponentV2, AuditEntry>(
                BulkRegistrationActionDataPanelComponentV2,
                userAction,
                80);
              break;
          case SystemActions.LeadRegistration:
              dialogRef = this.promptService.openDialog<RegistrationActionDataPanelComponent, AuditEntry>(
                RegistrationActionDataPanelComponent,
                userAction,
                80);
              break;
          case SystemActions.LeadDataUpdate:
              dialogRef = this.promptService.openDialog<UpdateActionDataPanelComponent, AuditEntry>(
                UpdateActionDataPanelComponent,
                userAction,
                40);
              break;
          case SystemActions.LeadExclusion:
              dialogRef = this.promptService.openDialog<RemoveActionDataPanelComponent, AuditEntry>(
                RemoveActionDataPanelComponent,
                userAction,
                80);
        }
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