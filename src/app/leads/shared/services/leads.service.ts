import { HttpClient, HttpEvent, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { Lead } from "../models/lead";
import { DataService } from "src/app/shared/data-access/data-service.service";
import { ApplicationResponse } from "src/app/shared/core/api-response/application-response";
import { RevisionUpdate } from "./conflict-resolution/revision-update";
import { Permissions } from "src/app/core/security/permissions";
import { OneTimePasswordService } from "src/app/core/security/authorization/components/one-time-password/one-time-password.service";

@Injectable({
  providedIn: "root",
})
export class LeadsService extends DataService<Lead> {
  private static LeadEndpoint = "leads";

  private leadRevisionUpdateSubscription = new Subject<RevisionUpdate>();
  onLeadRevisionUpdate$ = this.leadRevisionUpdateSubscription.asObservable();

  setLeadNewRevision(revisionUpdate: RevisionUpdate) {
    this.leadRevisionUpdateSubscription.next(revisionUpdate);
  }

  constructor(
    httpClient: HttpClient,
    private oneTimePasswordService: OneTimePasswordService) {
    super(httpClient, LeadsService.LeadEndpoint);
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

  search(cnpjRazaoSocial: string, leadId: string | null): Observable<ApplicationResponse<boolean>> {
    return this.httpClient.get<ApplicationResponse<boolean>>(
      `${environment.apiUrl}/${
        LeadsService.LeadEndpoint
      }/search?searchTerm=${encodeURIComponent(
        cnpjRazaoSocial
      )}&leadId=${leadId}`
    );
  }

  removeLead(leadId: string, revision: string): Observable<ApplicationResponse<any>> {

    return this.httpClient
               .delete<ApplicationResponse<Lead>>(`${environment.apiUrl}/${LeadsService.LeadEndpoint}/${leadId}?revision=${encodeURIComponent(revision)}`,
               {
                headers: {
                  resource : Permissions.Delete,
                  otp: this.oneTimePasswordService.getInformedCode()
                }
               });

  }
}

//For request simulation purposes
// return  of({ success : true, data: false, operationCode: "1001" })
//         .pipe(
//           delay(2000),
//           map(res => res)
//         );
