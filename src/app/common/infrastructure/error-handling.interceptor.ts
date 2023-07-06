import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { EMPTY, Observable, TimeoutError, catchError, finalize, map, retry, tap, throwError, timeout } from 'rxjs';
import { Injectable } from '@angular/core';
import { MessageType } from '../ui/widgets/prompt-dialog/message-type';
import { NotificationService } from '../ui/widgets/notification-dialog/notification.service';
import { ActivityIndicatorService } from '../ui/widgets/activity-indicator/activity-indicator.service';
import { environment } from 'src/environments/environment';
import { Inconsistency } from '../inconsistency';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

  constructor(
    private notificationService: NotificationService,
    private activityIndicatorService: ActivityIndicatorService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    var request = req.clone({
      setHeaders : {
        [environment.apiKeyHeaderName] : environment.apiKeyHeaderValue
      }
    });

    return next
            .handle(request)
            .pipe(
                tap(() => this.activityIndicatorService.display()),
                timeout(30000),
                //retry({ count : 3, delay : Math.random() * 1368 }),
                catchError(error => this.handleError(error)),
                finalize(() => this.activityIndicatorService.hide())
            );
  }

  handleError(data: any): Observable<HttpEvent<any>> {

    let message = '';

    if (data.error) {

      if (data.error.inconsistencies) {

        message += 'Encontrada(s) uma ou mais inconsistências ao processar a solicitação:';

        data.error.inconsistencies.forEach((inc: Inconsistency) => {
          message += inc.description + '\n';
        });

      } else if (data.error.message) {
        message = data.error.message;
      } else {

        message = "Houve um erro ao tentar processar a solicitação";

        if (data instanceof HttpErrorResponse) {
          if (data.status === 0 && !data.ok) {
            message += ": servidor indisponível"
          }
        }
    
        if (data instanceof TimeoutError) {
            message += ": tempo limite excedido"
        }

        message += '. Por favor, entre em contato com o suporte/administrador da aplicação e reporte o ocorrido.Pedimos desculpas pelo inconveniente.';
      }
    }
    
    this.notificationService.displayMessage(message, MessageType.Error);

    return EMPTY;
  }
}

export const ErrorHandlerInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorHandlerInterceptor,
  multi: true
};
