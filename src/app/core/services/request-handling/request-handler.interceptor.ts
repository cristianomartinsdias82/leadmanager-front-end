import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpEventType,
} from "@angular/common/http";
import {
  Observable,
  catchError,
  finalize,
  tap,
  throwError,
  timeout,
} from "rxjs";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { ConflictResolutionService } from "../conflict-handling/conflict-resolution.service";
import { handleError } from "./handle-error.function";
import { NotificationPanelService } from "src/app/shared/ui/widgets/notification-panel/notification-panel.service";
import { ActivityIndicatorService } from "src/app/shared/ui/widgets/activity-indicator/activity-indicator.service";

@Injectable()
export class RequestHandlerInterceptor implements HttpInterceptor {
  constructor(
    private conflictResolutionService: ConflictResolutionService,
    private notificationPanelService: NotificationPanelService,
    private activityIndicatorService: ActivityIndicatorService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let percentage = 0;
    const EndOfOperation = -1;
    var request = req.clone({
      setHeaders: {
        [environment.apiKeyHeaderName]: environment.apiKeyHeaderValue,
      },
    });

    return next.handle(request).pipe(
      tap(() => this.activityIndicatorService.show(req.reportProgress)),
      tap((event: HttpEvent<any>) => {
        if (req.reportProgress) {
          if (event.type === HttpEventType.UploadProgress) {
            percentage = Math.round((100 * event.loaded) / event.total!);

            this.activityIndicatorService.updateProgressPercentage(percentage);

            return percentage;
          } else if (event instanceof HttpErrorResponse) {
            return throwError(
              () =>
                new Error(
                  "Falha ao tentar enviar o arquivo. Por favor, tente novamente."
                )
            );
          } else {
            this.activityIndicatorService.updateProgressPercentage(100);
          }
        }

        return EndOfOperation;
      }),
      timeout(environment.requestTimeoutInSecs * 1000),
      //retry({ count : 3, delay : Math.random() * 1367 }),
      //catchError((error) => this.handleError(error, request)), //WORKS      
      catchError((error) => handleError(
                              error,
                              request,
                              this.notificationPanelService,
                              this.conflictResolutionService)),
      finalize(() => this.activityIndicatorService.hide(req.reportProgress))
    );
  }

  // private handleError(
  //   data: any,
  //   request: HttpRequest<any>
  // ): Observable<HttpEvent<any>> {
  //   let message = "";

  //   if (data.error) {
  //     if (data.error.operationCode === OperationCodes.ConcurrencyIssue) {
  //       return this.conflictResolutionService.resolve(
  //         data.error.data,
  //         request,
  //         data.error.message
  //       );
  //     } else if (data.error.inconsistencies) {
  //       message =
  //         "Encontrada(s) uma ou mais inconsistências ao processar a solicitação:";
  //     } else if (data.error.message) {
  //       message = data.error.message;
  //     } else {
  //       message = "Houve um erro ao tentar processar a solicitação";

  //       if (data instanceof HttpErrorResponse) {
  //         if (data.status === 0 && !data.ok) {
  //           message += ": servidor indisponível";
  //         }
  //       }

  //       if (data instanceof TimeoutError) {
  //         message += ": tempo limite excedido";
  //       }

  //       message +=
  //         ". Por favor, entre em contato com o suporte/administrador da aplicação e reporte o ocorrido. Pedimos desculpas pelo inconveniente.";
  //     }
  //   }

  //   this.notificationPanelService.show(
  //     message,
  //     data.error.inconsistencies,
  //     null!
  //   );

  //   return EMPTY;
  // }
}
