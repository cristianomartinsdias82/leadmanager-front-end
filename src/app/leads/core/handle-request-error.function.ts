import { HttpErrorResponse, HttpEvent, HttpRequest, HttpStatusCode } from "@angular/common/http";
import { EMPTY, Observable, TimeoutError, throwError } from "rxjs";
import { NotificationPanelService } from "src/app/shared/ui/widgets/notification-panel/notification-panel.service";
import { OperationCodes } from "src/app/shared/core/api-response/operation-codes";
import { ConflictResolutionService } from "src/app/shared/conflict-resolution/conflict-resolution.service";
import { environment } from "src/environments/environment";
import { ErrorMessages } from "../shared/messages/error-messages";

export function handleRequestError(
    data: any,
    request: HttpRequest<any>,
    notificationPanelService: NotificationPanelService,
    conflictResolutionService: ConflictResolutionService<any>): Observable<HttpEvent<any>> {

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

    if ([environment.oneTimePassword.otpChallengeStatusCode,
         environment.oneTimePassword.otpInvalidStatusCode,
         environment.oneTimePassword.otpExpiredStatusCode].indexOf(Number(data.status)) > -1) {

      return throwError(() => {
        return { statusCode: data.status }
      });

    }
    else if ([HttpStatusCode.Unauthorized, HttpStatusCode.Forbidden].indexOf(Number(data.status)) > -1) {

      message = ErrorMessages.AccessDenied;
      
    }

  }

  notificationPanelService.show(message, data.error?.inconsistencies, null!);
  
  return EMPTY;
}