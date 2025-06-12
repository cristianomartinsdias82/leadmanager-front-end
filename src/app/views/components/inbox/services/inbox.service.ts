import { Inject, Injectable, LOCALE_ID } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { BehaviorSubject, map, Observable } from "rxjs";
import { ApplicationResponse } from "src/app/shared/core/api-response/application-response";
import { ReportGenerationRequest } from "../models/report-generation-request";
import { ReportGenerationMessage } from "../models/report-generation-message";
import { DatePipe } from "@angular/common";

@Injectable({ providedIn: "root" })
export class InboxService {
  constructor(
    private httpClient: HttpClient,
    @Inject(LOCALE_ID) private locale: string
  ) {}

  private static ReportGenerationRequestsEndpoint = "reporting";

  private reportGenerationMessagesSubscription = new BehaviorSubject<ReportGenerationMessage[]>([]);
  reportGenerationMessages$ = this.reportGenerationMessagesSubscription.asObservable();

  loadInboxMessages() {
    this.fetchReportGenerationReadinessMessages().subscribe({
      next: (messages) =>
        this.reportGenerationMessagesSubscription.next(messages),
    });
  }

  fetchReportGenerationReadinessMessages(): Observable<ReportGenerationMessage[]> {
    return this.httpClient
      .get<ApplicationResponse<ReportGenerationRequest[]>>(
        `${environment.apiUrl}/${InboxService.ReportGenerationRequestsEndpoint}/readiness-messages`,
        {}
      )
      .pipe(
        map(
          (response) =>
            response.data?.map(
              (request) =>
                ({
                  text: `A solicitação do relatório de ${
                    request.feature
                  } realizada em ${new DatePipe(this.locale).transform(
                    request.requestedAt,
                    "dd/MM/yyyy hh:mm"
                  )} ${this.getRequestStatusDescription(request)}.`,
                  requestData: request,
                } as ReportGenerationMessage)
            ) || []
        )
      );
  }

  dismissReportReadinessMessage(id: number) {
    this.httpClient
      .put(
        `${environment.apiUrl}/${InboxService.ReportGenerationRequestsEndpoint}/readiness-messages/${id}/dismiss`,
        {}
      )
      .subscribe({
        next: () => {
          const currentMessages =
            this.reportGenerationMessagesSubscription.getValue();
          this.reportGenerationMessagesSubscription.next(
            currentMessages.filter((it) => it.requestData.id !== id)
          );
        },
      });
  }

  private getRequestStatusDescription = (request: ReportGenerationRequest) => {
    switch (request.status) {
      case "Successful":
      case "Successful with retries":
        return "está disponível";
      case "Pending":
      case "ReadyForProcessing":
      case "Processing":
        return "está em andamento";
      case "Failed":
        return "falhou";
      default:
        return undefined;
    }
  };
}
