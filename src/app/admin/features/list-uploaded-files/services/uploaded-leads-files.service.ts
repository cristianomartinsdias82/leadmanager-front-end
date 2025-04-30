import { PromptService } from 'src/app/shared/ui/widgets/prompt-dialog/prompt.service';
import { UploadedFileInfo } from 'src/app/admin/features/list-uploaded-files/models/uploaded-file-info';
import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { PagingParameters } from 'src/app/shared/core/pagination/paging-parameters';
import { ApplicationResponse } from 'src/app/shared/core/api-response/application-response';
import { PagedList } from 'src/app/shared/core/pagination/paged-list';

@Injectable({providedIn:'root'})
export class UploadedLeadsFilesService {
    constructor(
      private httpClient: HttpClient,
      private promptService: PromptService) {
    }

    private static Endpoint = "leads";

    private uploadedFilesDataRetrievalSubscription = new BehaviorSubject<boolean>(true);
    onUploadedFilesDataRetrieve$ = this.uploadedFilesDataRetrievalSubscription.asObservable();

    private leadsFileRemoveSuccessSubscription = new Subject<{}>();
    onLeadsFileRemoveSuccessful$ = this.leadsFileRemoveSuccessSubscription.asObservable();

    fetch(search?: string, pagingParameters?: PagingParameters): Observable<ApplicationResponse<PagedList<UploadedFileInfo>>> {
    
            return this.httpClient
                        .get<ApplicationResponse<PagedList<UploadedFileInfo>>>(
                            `${environment.apiUrl}/${UploadedLeadsFilesService.Endpoint}/uploaded-files`,
                            {
                              params: {
                                search: search ?? '',
                                page: pagingParameters!.pageNumber,
                                pageSize: pagingParameters!.pageSize,
                                sortColumn: pagingParameters!.sortColumn,
                                sortDirection: pagingParameters!.sortDirection
                              }
                            })
                        .pipe(
                              tap((appResponse: ApplicationResponse<PagedList<UploadedFileInfo>>) => {
                                this.uploadedFilesDataRetrievalSubscription.next(appResponse.data!.itemCount > 0);
                              })
                            );
      }

      downloadFile(id: string) {

        this.httpClient
              .get(`${environment.apiUrl}/${UploadedLeadsFilesService.Endpoint}/uploaded-files/${id}/download`,
                   {observe: 'response', responseType: 'blob'})
              .pipe(
                tap((response: HttpResponse<Blob>) => {;

                  const link = document.createElement('a') as HTMLAnchorElement;
                  link.download = response.headers.get('Content-Disposition')?.split(';')[1].split('=')[1]!;
                  link.href = window.URL.createObjectURL(response.body!)
                  link.click();

                })
              )
              .subscribe();
      }

      removeFile(file: UploadedFileInfo) {

        this.promptService
            .openYesNoDialog(
              "Deseja realmente excluir o(s) arquivo(s) selecionado(s)?",
              () => this.httpClient
                          .delete(`${environment.apiUrl}/${UploadedLeadsFilesService.Endpoint}/uploaded-files`, {body:{ ids: [{ id: file.id, fileId: file.fileId }]}})
                          .subscribe({
                            next: () => this.leadsFileRemoveSuccessSubscription.next({})
                          }),
              () => {},
              "Confirmação");
        
      }
}