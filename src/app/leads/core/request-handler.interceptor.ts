import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpEventType
} from "@angular/common/http";
import {
  Observable,
  catchError,
  finalize,
  tap,
  throwError,
  timeout,
  mergeMap,
  //delay as delayOperator,
  //retryWhen,
  //scan
} from "rxjs";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { handleRequestError } from "./handle-request-error.function";
import { NotificationPanelService } from "src/app/shared/ui/widgets/notification-panel/notification-panel.service";
import { ActivityIndicatorService } from "src/app/shared/ui/widgets/activity-indicator/activity-indicator.service";
import { ConflictResolutionService } from "src/app/shared/conflict-resolution/conflict-resolution.service";
import { OidcSecurityService } from "angular-auth-oidc-client";

@Injectable()
export class RequestHandlerInterceptor implements HttpInterceptor {
  constructor(
    private conflictResolutionService: ConflictResolutionService<any>,
    private notificationPanelService: NotificationPanelService,
    private activityIndicatorService: ActivityIndicatorService,
    private oidcSecurityService: OidcSecurityService
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      let percentage = 0;
      const EndOfOperation = -1;

      const Delay = 1000;
      const count = environment.requestMaxAttempts - 1;
  
      return this.oidcSecurityService
                 .getAccessToken()
                 .pipe(
                  mergeMap((access_token: string) => {

                    var request = req.clone({
                      setHeaders: {
                        [environment.apiKeyHeaderName]: environment.apiKeyHeaderValue,
                        'Authorization': `Bearer ${access_token}`
                      }
                    });

                    return next.handle(request).pipe(
                      tap(() => this.activityIndicatorService.show()),
                      tap((event: HttpEvent<any>) => {
                        if (req.reportProgress) {
                          if (event.type === HttpEventType.UploadProgress) {
                            percentage = Math.round((100 * event.loaded) / event.total!);
                
                            this.activityIndicatorService.report(`${percentage}%`);
                
                            return percentage;
                          } else if (event instanceof HttpErrorResponse) {
                            return throwError(
                              () =>
                                new Error(
                                  "Falha ao tentar enviar o arquivo. Por favor, tente novamente."
                                )
                            );
                          } else {
                            this.activityIndicatorService.report('100%');
                          }
                        }
                
                        return EndOfOperation;
                      }),
                      timeout(environment.requestTimeoutInSecs * Delay),
                      // retryWhen((errors) =>
                      //   //Esta implementação como está atualmente cria problemas (fica retentando) em 2 cenários:
                      //   //Quando a aplicação nega acesso ao recurso (falta de permissão) e
                      //   //Quando a aplicação pede OTP para confirmação da operação
                      //   //TODO: Tratar estes cenários para ignorar retentativas.
                      //   errors.pipe(
                      //     scan((acc, error) => ({count: acc.count + 1, error}),
                      //     {
                      //       count: 0,
                      //       error: undefined as any
                      //     }),
                      //     tap((current) => {
                      //       this.activityIndicatorService.report(`Tentativa #${current.count + 1}`);

                      //       if (current.count > count) {
                      //         throw current.error;
                      //       }
                      //     }),
                      //     delayOperator(3 * Delay)
                      //   )
                      // ),                      
                      catchError((error) =>
                        handleRequestError(
                          error,
                          request,
                          this.notificationPanelService,
                          this.conflictResolutionService
                        )
                      ),
                      finalize(() => this.activityIndicatorService.hide())
                    );
                  })
                 );
    }
}
