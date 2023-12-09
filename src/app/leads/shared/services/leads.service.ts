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
import { ErrorMessages } from "../messages/error-messages";
import { PromptService } from "src/app/shared/ui/widgets/prompt-dialog/prompt.service";

@Injectable({
  providedIn: "root",
})
export class LeadsService extends DataService<Lead> {

  private static LeadEndpoint = "leads";
  constructor(
    httpClient: HttpClient,
    private oneTimePasswordService: OneTimePasswordService,
    private promptService: PromptService)
  {

    super(httpClient, LeadsService.LeadEndpoint);

  }  

  private leadRevisionUpdateSubscription = new Subject<RevisionUpdate>();
  onLeadRevisionUpdate$ = this.leadRevisionUpdateSubscription.asObservable();

  private leadRemoveSuccessSubscription = new Subject<{}>();
  onLeadRemoveSuccessful$ = this.leadRemoveSuccessSubscription.asObservable();

  setLeadNewRevision(revisionUpdate: RevisionUpdate) {
    this.leadRevisionUpdateSubscription.next(revisionUpdate);
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

  removeLead(lead: Lead, skipConfirmation = false) {

    const action = () => {
      this.httpClient
          .delete<ApplicationResponse<Lead>>(`${environment.apiUrl}/${LeadsService.LeadEndpoint}/${lead.id!}?revision=${encodeURIComponent(lead.revision!)}`,
          {
            headers: {
              resource : Permissions.Delete,
                otp: this.oneTimePasswordService.getInformedCode()
              }
          })
          .subscribe({
            next: () => {
              this.leadRemoveSuccessSubscription.next({});
            },
            error: (err) => {
                  
              let message = '';
              let displayOneTimePasswordDialog = true;

              switch (err.statusCode) {
                case environment.oneTimePassword.otpInvalidStatusCode: { message = ErrorMessages.CodigoInvalido; break; }
                case environment.oneTimePassword.otpExpiredStatusCode: { message = ErrorMessages.CodigoInvalido; break; }
                case environment.oneTimePassword.otpChallengeStatusCode: { message = ''; break; }
                default: { displayOneTimePasswordDialog = false;
                  //TODO: Implement a Global error handler
                  //TODO: Next, throw an error from here so the global error handler can catch and handle it more properly
                  //this.notificationPanelService.show(`${ErrorMessages.ErroAoProcessarSolicitacao}. ${ErrorMessages.EntreEmContatoSuporteAdm}`, null!, null!);
                }
              }

              if (displayOneTimePasswordDialog) {
                    
                setTimeout(() => {
                  this.oneTimePasswordService
                      .openDialog({
                        onSendCodeRequest: () => { this.removeLead(lead, true); },
                          resource: Permissions.Delete
                      })
                      .subscribe(_ => this.oneTimePasswordService.setMessage(message));
                }, 100);

              }
            }
          });
    };

    if (!skipConfirmation) {
      this.promptService.openYesNoDialog(
        `Deseja realmente remover o lead '${lead.razaoSocial}'?`,
        () => {
          action();
        },
        () => {},
        "Confirmação de exclusão"
      );
    } else {
      action();
    }
  }
}

//For request simulation purposes
// return  of({ success : true, data: false, operationCode: "1001" })
//         .pipe(
//           delay(2000),
//           map(res => res)
//         );
