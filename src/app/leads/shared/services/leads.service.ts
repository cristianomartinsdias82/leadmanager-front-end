import { HttpClient, HttpEvent, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { Lead } from "../models/lead";
import { DataService } from "src/app/shared/data-access/data-service.service";
import { ApplicationResponse } from "src/app/shared/core/api-response/application-response";
import { RevisionUpdate } from "./conflict-resolution/revision-update";
import { Permissions } from "src/app/core/security/permissions";
import { OneTimePasswordService } from "src/app/core/security/authorization/components/one-time-password/one-time-password.service";

@Injectable({ providedIn: "root" })
export class LeadsService extends DataService<Lead> {

  private static LeadEndpoint = "leads";
  constructor(
    httpClient: HttpClient,
    private oneTimePasswordService: OneTimePasswordService)
  {
    super(httpClient, LeadsService.LeadEndpoint);
  }

  private leadRevisionUpdateSubscription = new Subject<RevisionUpdate>();
  onLeadRevisionUpdate$ = this.leadRevisionUpdateSubscription.asObservable();

  private leadRemoveSuccessSubscription = new Subject<{}>();
  onLeadRemoveSuccessful$ = this.leadRemoveSuccessSubscription.asObservable();

  public leadSearchSubscription = new BehaviorSubject<string>('');
  onLeadSearch$ = this.leadSearchSubscription.asObservable();

  setLeadNewRevision(revisionUpdate: RevisionUpdate) {
    this.leadRevisionUpdateSubscription.next(revisionUpdate);
  }

  setLeadSearch(searchTerm: string) {
    this.leadSearchSubscription.next(searchTerm);
  }

  uploadLeadsFile(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append("file", file);

    const req = new HttpRequest(
      "POST",
      `${environment.apiUrl}/${LeadsService.LeadEndpoint}/bulk-insert`,
      formData,
      { reportProgress: true }
    );

    return this.httpClient.request(req);
  }

  exists(cnpjRazaoSocial: string, leadId: string | null): Observable<ApplicationResponse<boolean>> {
    return this.httpClient.get<ApplicationResponse<boolean>>(
      `${environment.apiUrl}/${LeadsService.LeadEndpoint}/exists?searchTerm=${encodeURIComponent(cnpjRazaoSocial)}&leadId=${leadId}`
    );
  }

  removeLead(lead: Lead) {

    const requiredPermission = Permissions.Delete;

    this.oneTimePasswordService.executeFlow<Lead>(
      (): Observable<ApplicationResponse<Lead>> => this.httpClient.delete<ApplicationResponse<Lead>>(
        `${environment.apiUrl}/${LeadsService.LeadEndpoint}/${lead.id!}?revision=${encodeURIComponent(lead.revision!)}`,
        {
          headers: {
            resource : requiredPermission,
              otp: this.oneTimePasswordService.getInformedCode()
          }
        }
      ),
      (_) => this.leadRemoveSuccessSubscription.next({}),
      requiredPermission,
      `Deseja realmente remover o lead '${lead.razaoSocial}'?`,
      'Confirmação de exclusão'
    );

  }
}

//For request simulation purposes
// return  of({ success : true, data: false, operationCode: "1001" })
//         .pipe(
//           delay(2000),
//           map(res => res)
//         );
