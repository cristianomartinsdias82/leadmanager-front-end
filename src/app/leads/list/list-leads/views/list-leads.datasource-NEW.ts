// import { BehaviorSubject, combineLatest, EMPTY, Observable, of } from 'rxjs';
// import { DataSource } from '@angular/cdk/collections';
// import { map, share, switchMap } from 'rxjs/operators';
// import { Sort } from '@angular/material/sort';
// import { ListSortDirection } from 'src/app/shared/core/pagination/list-sort-direction';
// import { PagedList } from 'src/app/shared/core/pagination/paged-list';
// import { LeadsService } from 'src/app/leads/shared/services/leads.service';
// import { Lead } from 'src/app/leads/shared/models/lead';

// //REOPEN THE FOLLOWING URLs
// //https://stackblitz.com/edit/angular-ivy-pys73v?file=src%2Fapp%2Fmodels%2Fcollection-datasource.model.ts,src%2Fapp%2Fcomponents%2Freference-table%2Freference-table.component.html,src%2Fapp%2Fmodels%2Fpaginated-collection.model.ts
// //https://stackblitz.com/edit/angular-ivy-pys73v?file=src%2Fapp%2Fmodels%2Fcollection-datasource.model.ts,src%2Fapp%2Fcomponents%2Freference-table%2Freference-table.component.ts
// export class ListLeadsDataSourceNEW extends DataSource<Lead> {
//   pageNumber: BehaviorSubject<number>;
//   pageSize: BehaviorSubject<number>;
//   sortColumn: BehaviorSubject<string>;
//   sortDirection: BehaviorSubject<ListSortDirection>;
//   page$: Observable<PagedList<Lead>>;
//   search: BehaviorSubject<string>;

//   constructor(
//     private leadsService: LeadsService,
//     sortColumn: string,
//     sortDirection: ListSortDirection,
//     pageNumber: number,
//     pageSize: number) {

//     super();

//     this.sortColumn = new BehaviorSubject<string>(sortColumn);
//     this.sortDirection = new BehaviorSubject<ListSortDirection>(sortDirection);
//     this.pageNumber = new BehaviorSubject<number>(pageNumber);
//     this.pageSize = new BehaviorSubject<number>(pageSize);
//     this.search = this.leadsService.leadSearchSubscription;

//     const param$ = combineLatest([this.sortColumn, this.sortDirection, this.pageSize, this.pageNumber, this.search]);

//     this.page$ = param$.pipe(
//         switchMap(([sortColumn, sortDirection, pageSize, pageNumber, search]) => this.leadsService.fetch(search, { sortColumn, pageNumber, sortDirection, pageSize })
//         .pipe(
//           map(res => res.data!)
//         )
//       ),
//       share()
//     );
//   }

//   searchTrigger(search: string): void {

//     if (this.search.getValue() !== search) {
//       this.search.next(search);
//     }

//   }

//   paginationTrigger(pageNumberEvent: number, pageSizeEvent: number): void {

//     if (this.pageNumber.getValue() !== pageNumberEvent) {
//       this.pageNumber.next(pageNumberEvent);
//     }

//     if (this.pageSize.getValue() !== pageSizeEvent) {
//       this.pageSize.next(pageSizeEvent);
//     }

//   }

//   sortingTrigger(sortEvent: Sort) {

//     if (sortEvent.active !== this.sortColumn.getValue()) {
//       this.sortColumn.next(sortEvent.active);
//     }

//     const currentDirection = this.sortDirection.getValue() === ListSortDirection.Ascending ? 'asc' : 'desc';
//     if (sortEvent.direction !== currentDirection) {
//       this.sortDirection.next(sortEvent.direction === 'asc' ? ListSortDirection.Ascending : ListSortDirection.Descending);
//     }

//   }

//   connect(): Observable<Lead[]> {
//     return this.page$.pipe(map(page => page.items));
//   }

//   disconnect(): void {}
// }
