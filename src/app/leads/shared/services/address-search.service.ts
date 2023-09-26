import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { Endereco } from '../models/endereco';
import { NotificationStickerService } from 'src/app/shared/ui/widgets/notification-sticker/notification-sticker.service';
import { MessageTypes } from 'src/app/shared/ui/notification/message-types';
import { ApplicationResponse } from 'src/app/shared/core/api-response/application-response';

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