import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, Observable, of as observableOf, merge } from 'rxjs';
import { SerializedLeadData } from '../../../../models/serialized-lead-data';
import { DataSource } from '@angular/cdk/collections';

export class BulkRegistrationActionDataPanelDataSource extends DataSource<SerializedLeadData> {

  data: SerializedLeadData[];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor(leads: SerializedLeadData[] ) {
    super();

    this.data = leads;
  }

  connect(): Observable<SerializedLeadData[]> {
    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(observableOf(this.data), this.paginator.page, this.sort.sortChange)
        .pipe(map(() => {
          return this.getPagedData(this.getSortedData([...this.data ]));
        }));
    } else {
      throw Error('Please set the paginator and sort on the data source before connecting.');
    }
  }

  private getPagedData(data: SerializedLeadData[]) {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  private getSortedData(data: SerializedLeadData[]) {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active.toLocaleLowerCase()) {
        case 'razaosocial': return compare(a.RazaoSocial, b.RazaoSocial, isAsc);
        case 'cidade': return compare(+a.Cidade, +b.Cidade, isAsc);
        case 'estado': return compare(+a.Estado, +b.Estado, isAsc);
        default: return 0;
      }
    });
  }

  disconnect() {}
}

function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}