import { HttpErrorResponse, HttpEvent, HttpRequest, HttpStatusCode } from "@angular/common/http";
import { EMPTY, Observable, TimeoutError, throwError } from "rxjs";
import { NotificationPanelService } from "src/app/shared/ui/widgets/notification-panel/notification-panel.service";
import { OperationCodes } from "src/app/shared/core/api-response/operation-codes";
import { environment } from "src/environments/environment";
import { ErrorMessages } from "../shared/messages/error-messages";
import { ConflictResolutionLeadDataService } from "../shared/services/conflict-resolution/conflict-resolution-lead-data.service";

export function handleRequestError(
    data: any,
    request: HttpRequest<any>,
    conflictResolutionService: ConflictResolutionLeadDataService,
    notificationPanelService: NotificationPanelService): Observable<HttpEvent<any>> {

  let message = "";
  const isHttpErrorResponse = data instanceof HttpErrorResponse;
  
  if (data instanceof TimeoutError) {
    message = `${ErrorMessages.ErrorWhenProcessingRequest}: tempo limite da requisição excedido.`;
  } else if (data.error) {
    if (data.error.operationCode === OperationCodes.ConcurrencyIssue) {
      return conflictResolutionService.resolve(data.error.data, request, data.error.message);
    } else if (data.error.inconsistencies) {
      message = ErrorMessages.InconsistenciesFound;
    } else if (data.error.message) {
      message = data.error.message;
    } else {
      message = ErrorMessages.ErrorWhenProcessingRequest;

      if (isHttpErrorResponse) {
        if (data.status === 0 && !data.ok) {
          message += ": servidor indisponível";
        }
      }

      message += `. ${ErrorMessages.ContactSupportAdmin}`;
    }
  } else if (isHttpErrorResponse) {

    const statusCode = +data.status;
    if ([environment.oneTimePassword.otpChallengeStatusCode,
         environment.oneTimePassword.otpInvalidStatusCode,
         environment.oneTimePassword.otpExpiredStatusCode].indexOf(statusCode) > -1) {

      return throwError(() => {
        return { statusCode: data.status }
      });

    }
    else if ([HttpStatusCode.Unauthorized, HttpStatusCode.Forbidden].indexOf(statusCode) > -1) {

      message = ErrorMessages.AccessDenied;
      
    }
    else if (statusCode === HttpStatusCode.NotFound) {

      message = ErrorMessages.RecordNotFound;

    }

  }

  notificationPanelService.show(message, data.error?.inconsistencies, null!);
  
  return EMPTY;
}