import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lead } from '../models/lead';
import { DataService } from 'src/app/common/services/data-service.service';
import { Observable, catchError, delay, map, of, throwError } from 'rxjs';
import { ApplicationResponse } from 'src/app/common/application-response';
import { environment } from 'src/environments/environment';
import { MessageType } from 'src/app/common/ui/widgets/prompt-dialog/message-type';
import { NotificationService } from 'src/app/common/ui/widgets/notification-dialog/notification.service';

@Injectable({
  providedIn: 'root'
})
export class LeadsService extends DataService<Lead> {

  private static LeadEndpoint = 'leads';

  constructor(
    httpClient: HttpClient,
    private notificationService: NotificationService) {
    
    super(
      httpClient,
      LeadsService.LeadEndpoint);
   }

   search(cnpjRazaoSocial: string, leadId: string | null): Observable<ApplicationResponse<boolean>> {
    
    //For request simulation purposes
    // return  of({ success : true, data: false, operationCode: "1001" })
    //         .pipe(
    //           delay(2000),
    //           map(res => res)
    //         );
    
    return this.httpClient
               .get<ApplicationResponse<boolean>>(`${environment.apiUrl}/${LeadsService.LeadEndpoint}/search?searchTerm=${encodeURIComponent(cnpjRazaoSocial)}&leadId=${leadId}`)
               .pipe(
                  catchError((err) => this.handleError(err, 'Erro ao tentar obter os dados!'))
               );
  }

  handleError(err: HttpErrorResponse, errorMessage: string) : Observable<any>
  {
    this.notificationService.displayMessage(errorMessage, MessageType.Error);

    return throwError(() => { return { error : err, message: errorMessage } });
  }
}