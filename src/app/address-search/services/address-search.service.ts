import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, catchError, throwError, of, map, flatMap, mergeMap } from 'rxjs';
import { Endereco } from '../models/endereco';
import { NotificationService } from 'src/app/common/ui/widgets/notification-dialog/notification.service';
import { MessageType } from 'src/app/common/ui/widgets/prompt-dialog/message-type';
import { ApplicationResponse } from 'src/app/common/application-response';

@Injectable({
  providedIn: 'root'
})
export class AddressSearchService {

  constructor(
    private httpClient: HttpClient,
    private notificationService: NotificationService) { }

  search(cep: string): Observable<ApplicationResponse<Endereco>> {
    return this.httpClient
               .get<ApplicationResponse<Endereco>>(`${environment.apiUrl}/addresses/search?cep=${encodeURIComponent(cep)}`)
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