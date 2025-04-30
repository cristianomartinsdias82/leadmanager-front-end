import { UploadedLeadsFilesService } from '../services/uploaded-leads-files.service';
import { BehaviorSubject, combineLatest, map, Observable, share, switchMap } from "rxjs";
import { UploadedFileInfo } from "../models/uploaded-file-info";
import { ListSortDirection } from "src/app/shared/core/pagination/list-sort-direction";
import { Sort } from "@angular/material/sort";
import { PagedList } from "src/app/shared/core/pagination/paged-list";
import { DataSource } from "@angular/cdk/collections";

//https://stackblitz.com/edit/angular-ivy-pys73v?file=src%2Fapp%2Fmodels%2Fcollection-datasource.model.ts,src%2Fapp%2Fcomponents%2Freference-table%2Freference-table.component.html,src%2Fapp%2Fmodels%2Fpaginated-collection.model.ts
//https://stackblitz.com/edit/angular-ivy-pys73v?file=src%2Fapp%2Fmodels%2Fcollection-datasource.model.ts,src%2Fapp%2Fcomponents%2Freference-table%2Freference-table.component.ts
export class UploadedLeadsFilesDataSource extends DataSource<UploadedFileInfo> {

  pageNumber: BehaviorSubject<number>;
  pageSize: BehaviorSubject<number>;
  sortColumn: BehaviorSubject<string>;
  sortDirection: BehaviorSubject<ListSortDirection>;
  page$: Observable<PagedList<UploadedFileInfo>>;
  //search: BehaviorSubject<string>;

  constructor(
    private uploadedLeadsFilesService: UploadedLeadsFilesService,
    sortColumn: string,
    sortDirection: ListSortDirection,
    pageNumber: number,
    pageSize: number) {

    super();

    this.sortColumn = new BehaviorSubject<string>(sortColumn);
    this.sortDirection = new BehaviorSubject<ListSortDirection>(sortDirection);
    this.pageNumber = new BehaviorSubject<number>(pageNumber);
    this.pageSize = new BehaviorSubject<number>(pageSize);
    //this.search = this.uploadedLeadsFilesService.uploadedFileSearchSubscription;

    const param$ = combineLatest([this.sortColumn, this.sortDirection, this.pageSize, this.pageNumber/*, this.search*/]);

    this.page$ = param$.pipe(
        switchMap(([sortColumn, sortDirection, pageSize, pageNumber/*, search*/]) => this.uploadedLeadsFilesService
                                                                                          .fetch(""/*search*/,
                                                                                                {
                                                                                                  sortColumn,
                                                                                                  pageNumber,
                                                                                                  sortDirection,
                                                                                                  pageSize
                                                                                                })
        .pipe(
          map(res => res.data!)
        )
      ),
      share()
    );
  }

  // searchTrigger(search: string): void {

  //   if (this.search.getValue() !== search) {
  //     this.search.next(search);
  //   }

  // }

  paginationTrigger(pageNumberEvent: number, pageSizeEvent: number): void {

    if (this.pageNumber.getValue() !== pageNumberEvent) {
      this.pageNumber.next(pageNumberEvent);
    }

    if (this.pageSize.getValue() !== pageSizeEvent) {
      this.pageSize.next(pageSizeEvent);
    }

  }

  sortingTrigger(sortEvent: Sort) {

    if (sortEvent.active !== this.sortColumn.getValue()) {
      this.sortColumn.next(sortEvent.active);
    }

    const currentDirection = this.sortDirection.getValue() === ListSortDirection.Ascending ? 'asc' : 'desc';
    if (sortEvent.direction !== currentDirection) {
      this.sortDirection.next(sortEvent.direction === 'asc' ? ListSortDirection.Ascending : ListSortDirection.Descending);
    }

  }

  connect(): Observable<UploadedFileInfo[]> {
    return this.page$.pipe(map(page => page.items));
  }

  disconnect(): void {}
}
