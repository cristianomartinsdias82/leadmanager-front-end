import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, map } from 'rxjs';
import { PagingParameters } from 'src/app/common/paging-parameters';
import { ApplicationResponse } from '../application-response';
import { PagedList } from '../paged-list';

export abstract class DataService<T> {

  constructor(
    protected httpClient: HttpClient,
    private endpoint: string) { }

  fetch(pagingParameters?: PagingParameters): Observable<ApplicationResponse<PagedList<T>>> {

    return this.httpClient
                .get<ApplicationResponse<PagedList<T>>>(
                    `${environment.apiUrl}/${this.endpoint}`,
                    {
                      params: {
                        page: pagingParameters!.pageNumber,
                        pageSize: pagingParameters!.pageSize,
                        sortColumn: pagingParameters!.sortColumn,
                        sortDirection: pagingParameters!.sortDirection
                      }
                    })
  }

  getById(id: string): Observable<ApplicationResponse<T>> {
    return this.httpClient.get<ApplicationResponse<T>>(`${environment.apiUrl}/${this.endpoint}/${id}`);
  }

  save(data: T, id: string | null): Observable<ApplicationResponse<any>> {

    if (id) {
      return this.httpClient
               .put<ApplicationResponse<any>>(`${environment.apiUrl}/${this.endpoint}/${id}`, data);
    }

    return this.httpClient
               .post<T>(`${environment.apiUrl}/${this.endpoint}`, data)
               .pipe(
                  map((result: any) => result.id)
               );
  }

  remove(id: string): Observable<ApplicationResponse<any>> {

    return this.httpClient
               .delete<ApplicationResponse<T>>(`${environment.apiUrl}/${this.endpoint}/${id}`);
               
  }
}