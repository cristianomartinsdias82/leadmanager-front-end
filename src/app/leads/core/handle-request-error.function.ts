import { HttpErrorResponse, HttpEvent, HttpRequest, HttpStatusCode } from "@angular/common/http";
import { EMPTY, Observable, TimeoutError, throwError } from "rxjs";
import { NotificationPanelService } from "src/app/shared/ui/widgets/notification-panel/notification-panel.service";
import { OperationCodes } from "src/app/shared/core/api-response/operation-codes";
import { ConflictResolutionService } from "src/app/shared/conflict-resolution/conflict-resolution.service";
import { environment } from "src/environments/environment";

export function handleRequestError(
    data: any,
    request: HttpRequest<any>,
    notificationPanelService: NotificationPanelService,
    conflictResolutionService: ConflictResolutionService<any>): Observable<HttpEvent<any>> {

  let message = "";
  const isHttpErrorResponse = data instanceof HttpErrorResponse;

  if (data.error) {
    if (data.error.operationCode === OperationCodes.ConcurrencyIssue) {
      return conflictResolutionService.resolve(data.error.data, request, data.error.message);
    } else if (data.error.inconsistencies) {
      message = "Encontrada(s) uma ou mais inconsistências ao processar a solicitação:";
    } else if (data.error.message) {
      message = data.error.message;
    } else {
      message = "Houve um erro ao tentar processar a solicitação";

      if (isHttpErrorResponse) {
        if (data.status === 0 && !data.ok) {
          message += ": servidor indisponível";
        }
      }

      if (data instanceof TimeoutError) {
        message += ": tempo limite excedido";
      }

      message += ". Por favor, entre em contato com o suporte/administrador da aplicação e reporte o ocorrido. Pedimos desculpas pelo inconveniente.";
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
      message = "Acesso negado para acessar o recurso solicitado.";
    }

  }

  notificationPanelService.show(message, data.error.inconsistencies, null!);

  return EMPTY;
}