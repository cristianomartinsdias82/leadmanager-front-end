import { BehaviorSubject, combineLatest, map, Observable, share, switchMap } from "rxjs";
import { ListSortDirection } from "src/app/shared/core/pagination/list-sort-direction";
import { Sort } from "@angular/material/sort";
import { PagedList } from "src/app/shared/core/pagination/paged-list";
import { DataSource } from "@angular/cdk/collections";
import { AuditEntry } from '../models/audit-entry';
import { UsersActionsService } from "../services/users-actions.service";
import { Query } from "src/app/shared/data-access/query";

//https://stackblitz.com/edit/angular-ivy-pys73v?file=src%2Fapp%2Fmodels%2Fcollection-datasource.model.ts,src%2Fapp%2Fcomponents%2Freference-table%2Freference-table.component.html,src%2Fapp%2Fmodels%2Fpaginated-collection.model.ts
//https://stackblitz.com/edit/angular-ivy-pys73v?file=src%2Fapp%2Fmodels%2Fcollection-datasource.model.ts,src%2Fapp%2Fcomponents%2Freference-table%2Freference-table.component.ts
export class UsersActionsDataSource extends DataSource<AuditEntry> {

  page$: Observable<PagedList<AuditEntry>>;
  query: BehaviorSubject<Query>;

  pageNumber: BehaviorSubject<number>;
  pageSize: BehaviorSubject<number>;
  sortColumn: BehaviorSubject<string>;
  sortDirection: BehaviorSubject<ListSortDirection>;

  constructor(
    private usersActionsService: UsersActionsService,
    queryOptions: Query
   ) {

    super();

    this.sortColumn = new BehaviorSubject<string>(queryOptions.pagingParameters!.sortColumn);
    this.sortDirection = new BehaviorSubject<ListSortDirection>(queryOptions.pagingParameters!.sortDirection);
    this.pageNumber = new BehaviorSubject<number>(queryOptions.pagingParameters!.pageNumber);
    this.pageSize = new BehaviorSubject<number>(queryOptions.pagingParameters!.pageSize);

    this.query = this.usersActionsService.querySubscription;

    const param$ = combineLatest([this.sortColumn, this.sortDirection, this.pageSize, this.pageNumber]);

    this.query.next(queryOptions);

    this.page$ = param$.pipe(
      switchMap(([sortColumn, sortDirection, pageSize, pageNumber]) =>
          this.usersActionsService
                .fetch({
                  ...this.usersActionsService.querySubscription.getValue(),
                  pagingParameters: {
                    sortColumn,
                    sortDirection,
                    pageSize,
                    pageNumber
                  }
                } as Query)
                .pipe(
                  map(res => res.data!)
                )
      ),
      share()
    );
  }

  render(isInFirstPage: () => boolean, toInitialPage: () => void) {
    if (isInFirstPage())
      this.pageNumber.next(1);
    else {
      toInitialPage();
    }    
  }

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

  connect(): Observable<AuditEntry[]> {
    return this.page$.pipe(map(page => page.items));
  }

  disconnect(): void {}
}
