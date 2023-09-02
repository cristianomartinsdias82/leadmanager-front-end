import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Observable, of as observableOf } from 'rxjs';

import { Lead } from '../../../common/models/lead'
import { EventEmitter } from '@angular/core';
import { PagingParameters } from 'src/app/common/paging-parameters';
import { ListSortDirection } from 'src/app/common/list-sort-direction';

export class ListLeadsDataSource extends DataSource<Lead> {
  data: Lead[] = [];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  sorted = new EventEmitter<PagingParameters>();
  pageChanged = new EventEmitter<PagingParameters>();

  constructor() {
    super();
  }

  connect(): Observable<Lead[]> {
    
    if (this.paginator && this.sort) {

      this.sort.sortChange.subscribe({
        next: (value: Sort) => {
          if (value.direction === '')
            return;

          this.sorted.emit({
            pageNumber : this.paginator!.pageIndex + 1,
            pageSize: this.paginator!.pageSize,
            sortColumn: value.active,
            sortDirection: ListLeadsDataSource.getSortDirection(value)
           });
        }
      });

      this.paginator.page.subscribe({
        next: (value: PageEvent) => {
          this.sorted.emit({
            pageNumber : value.pageIndex + 1,
            pageSize: value.pageSize,
            sortColumn: this.sort!.active === undefined || this.sort!.active === '' ? 'cnpj' : this.sort!.active,
            sortDirection: ListLeadsDataSource.getSortDirection(this.sort!)
           });
        }
      });

      return observableOf(this.data);

    } else {
      throw Error('Please set the paginator and sort on the data source before connecting.');
    }
  }

  private static getSortDirection(sort: Sort) : ListSortDirection {
    return sort.direction === 'asc' ? ListSortDirection.Ascending : ListSortDirection.Descending;
  }

  setPaginatorItemCount(itemCount: number) {
    setTimeout(() => this.paginator!.length = itemCount, 0);
  }

  disconnect(): void {}
}
