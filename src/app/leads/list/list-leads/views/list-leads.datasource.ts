import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { filter, map, startWith, switchMap } from 'rxjs';
import { Lead } from 'src/app/leads/shared/models/lead';
import { LeadsService } from 'src/app/leads/shared/services/leads.service';
import { ApplicationResponse } from 'src/app/shared/core/api-response/application-response';
import { ListSortDirection } from 'src/app/shared/core/pagination/list-sort-direction';
import { PagedList } from 'src/app/shared/core/pagination/paged-list';

export class ListLeadsDataSource {

  private dataSource = new MatTableDataSource<Lead>();
  private sortColumn = '';
  private sortDirection = ListSortDirection.Ascending;
  private static sortDirections = ['asc', 'desc'];

  constructor(
    private leadsService: LeadsService,
    private table:MatTable<Lead>,
    private paginator: MatPaginator,
    private sort: MatSort,
    initialSortColumnName: string) {
    
    this.sortColumn = initialSortColumnName;

    this.initialize();
  }

  private initialize() {

    //https://www.angularjswiki.com/material/mat-table-serverside-pagination/
    setTimeout(() => {
      
      this.dataSource.paginator = this.paginator;
      this.paginator
        .page
        .pipe(
          startWith({}),
          switchMap(() =>
              this.leadsService.fetch(
              this.leadsService.leadSearchSubscription.getValue(),
              {
                pageNumber: this.paginator.pageIndex + 1,
                pageSize: this.paginator.pageSize,
                sortColumn: this.sortColumn,
                sortDirection: this.sortDirection
              })
          ),
          map((response: ApplicationResponse<PagedList<Lead>>) => {
            this.paginator.length = response.data!.itemCount;

            return response.data!.items;
          })
        ).subscribe((leads:Lead[]) => {
          this.dataSource = new MatTableDataSource(leads);
          this.table.dataSource = this.dataSource;        
        });
    
      this.sort
        .sortChange
        .pipe(
          filter((sort:Sort) => ListLeadsDataSource.sortDirections.includes(sort.direction)),
          switchMap((sort: Sort) => {
                this.sortColumn = sort.active;
                this.sortDirection = ListLeadsDataSource.getSortDirection(sort);

                return this.leadsService.fetch(
                  this.leadsService.leadSearchSubscription.getValue(),
                  {
                    pageNumber: this.paginator.pageIndex + 1,
                    pageSize: this.paginator.pageSize,
                    sortColumn: this.sortColumn,
                    sortDirection: this.sortDirection
                  }
                )
          }),
          map((response: ApplicationResponse<PagedList<Lead>>) => {
              this.paginator.length = response.data!.itemCount;

              return response.data!.items;
          }))
          .subscribe((leads:Lead[]) => {
            this.dataSource = new MatTableDataSource(leads);
            this.table.dataSource = this.dataSource;
          }
        );

      this.leadsService.onLeadSearch$.subscribe({
        next: (searchTerm) => {
          this.leadsService.fetch(
            searchTerm,
            {
              pageNumber: 1,
              pageSize: this.paginator.pageSize,
              sortColumn: this.sortColumn,
              sortDirection: this.sortDirection,
            })
            .pipe(
              map((response: ApplicationResponse<PagedList<Lead>>) => {
                this.paginator.length = response.data!.itemCount;
              
                return response.data!.items;
              }))
            .subscribe((leads:Lead[]) => {
              this.dataSource = new MatTableDataSource(leads);
              this.table.dataSource = this.dataSource;
            });
        }
      });
    }, 0);
  }

  private static getSortDirection(sort: Sort) : ListSortDirection {
     return sort.direction === 'asc' ? ListSortDirection.Ascending : ListSortDirection.Descending;
  }
}
