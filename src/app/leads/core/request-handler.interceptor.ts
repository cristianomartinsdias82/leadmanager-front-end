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
} from "rxjs";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { handleRequestError } from "./handle-request-error.function";
import { NotificationPanelService } from "src/app/shared/ui/widgets/notification-panel/notification-panel.service";
import { ActivityIndicatorService } from "src/app/shared/ui/widgets/activity-indicator/activity-indicator.service";
import { ConflictResolutionLeadDataService } from "../shared/services/conflict-resolution/conflict-resolution-lead-data.service";
//import { OidcSecurityService } from "angular-auth-oidc-client";

@Injectable()
export class RequestHandlerInterceptor implements HttpInterceptor {
  constructor(
    private conflictResolutionService: ConflictResolutionLeadDataService,
    private notificationPanelService: NotificationPanelService,
    private activityIndicatorService: ActivityIndicatorService
    //private oidcSecurityService: OidcSecurityService,
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      let percentage = 0;
      const EndOfOperation = -1;
  
      // return this.oidcSecurityService
      //            .getAccessToken()
      //            .pipe(
      //             mergeMap((access_token: string) => {

      //               var request = req.clone({
      //                 setHeaders: {
      //                   [environment.apiKeyHeaderName]: environment.apiKeyHeaderValue,
      //                   'Authorization': `Bearer ${access_token}`
      //                 }
      //               });

      //               return next.handle(request).pipe(
      //                 tap(() => this.activityIndicatorService.show(req.reportProgress)),
      //                 tap((event: HttpEvent<any>) => {
      //                   if (req.reportProgress) {
      //                     if (event.type === HttpEventType.UploadProgress) {
      //                       percentage = Math.round((100 * event.loaded) / event.total!);
                
      //                       this.activityIndicatorService.updateProgressPercentage(percentage);
                
      //                       return percentage;
      //                     } else if (event instanceof HttpErrorResponse) {
      //                       return throwError(
      //                         () =>
      //                           new Error(
      //                             "Falha ao tentar enviar o arquivo. Por favor, tente novamente."
      //                           )
      //                       );
      //                     } else {
      //                       this.activityIndicatorService.updateProgressPercentage(100);
      //                     }
      //                   }
                
      //                   return EndOfOperation;
      //                 }),
      //                 timeout(environment.requestTimeoutInSecs * 1000),
      //                 //retry({ count : 3, delay : Math.random() * 1367 }),
      //                 //catchError((error) => this.handleError(error, request)), //WORKS
      //                 catchError((error) =>
      //                   handleRequestError(
      //                     error,
      //                     request,
      //                     this.notificationPanelService,
      //                     this.conflictResolutionService,
      //                     this.oneTimePasswordService
      //                   )
      //                 ),
      //                 finalize(() => this.activityIndicatorService.hide(req.reportProgress))
      //               );
      //             })
      //            );

      var request = req.clone({
        setHeaders: {
          [environment.apiKeyHeaderName]: environment.apiKeyHeaderValue,
        }
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
        //catchError((error) => this.handleError(error, request)), //WORKS,
        catchError((error) => handleRequestError(
                                      error,
                                      request,
                                      this.notificationPanelService,
                                      this.conflictResolutionService)
        ),
        finalize(() => this.activityIndicatorService.hide(req.reportProgress))
      );
    }
}
