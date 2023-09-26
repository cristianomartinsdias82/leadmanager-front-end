import { HttpErrorResponse, HttpEvent, HttpRequest } from "@angular/common/http";
import { EMPTY, Observable, TimeoutError } from "rxjs";
import { OperationCodes } from "../../operation-codes";
import { ConflictResolutionService } from "../conflict-handling/conflict-resolution.service";
import { NotificationPanelService } from "src/app/shared/ui/widgets/notification-panel/notification-panel.service";

export function handleError(
    data: any,
    request: HttpRequest<any>,
    notificationPanelService: NotificationPanelService,
    conflictResolutionService: ConflictResolutionService): Observable<HttpEvent<any>> {
  let message = "";

  if (data.error) {

    if (data.error.operationCode === OperationCodes.ConcurrencyIssue) {
      return conflictResolutionService.resolve(
        data.error.data,
        request,
        data.error.message
      );
    } else if (data.error.inconsistencies) {
      message =
        "Encontrada(s) uma ou mais inconsistências ao processar a solicitação:";
    } else if (data.error.message) {
      message = data.error.message;
    } else {
      message = "Houve um erro ao tentar processar a solicitação";

      if (data instanceof HttpErrorResponse) {
        if (data.status === 0 && !data.ok) {
          message += ": servidor indisponível";
        }
      }

      if (data instanceof TimeoutError) {
        message += ": tempo limite excedido";
      }

      message +=
        ". Por favor, entre em contato com o suporte/administrador da aplicação e reporte o ocorrido. Pedimos desculpas pelo inconveniente.";
    }
  }

  notificationPanelService.show(message, data.error.inconsistencies, null!);

  return EMPTY;
}
