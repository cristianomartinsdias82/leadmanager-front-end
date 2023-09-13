import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { Endereco } from '../models/endereco';
import { MessageTypes } from 'src/app/common/ui/notification/message-types';
import { ApplicationResponse } from 'src/app/common/application-response';
import { NotificationStickerService } from 'src/app/common/ui/widgets/notification-sticker/notification-sticker.service';

@Injectable({
  providedIn: 'root'
})
export class AddressSearchService {

  constructor(
    private httpClient: HttpClient,
    private notificationStickerService: NotificationStickerService) { }

  search(cep: string): Observable<ApplicationResponse<Endereco>> {
    return this.httpClient
               .get<ApplicationResponse<Endereco>>(`${environment.apiUrl}/addresses/search?cep=${encodeURIComponent(cep)}`)
               .pipe(
                  catchError((err) => this.handleError(err, 'Erro ao tentar obter os dados!'))
               );
  }

  handleError(err: HttpErrorResponse, errorMessage: string) : Observable<any>
  {
    this.notificationStickerService.show(errorMessage, MessageTypes.Error);

    return throwError(() => { return { error : err, message: errorMessage } });
  }
}