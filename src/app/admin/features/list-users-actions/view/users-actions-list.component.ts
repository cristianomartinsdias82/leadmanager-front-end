import { Sort } from '@angular/material/sort';
import { Component, ViewChild } from '@angular/core';
import { ListSortDirection } from 'src/app/shared/core/pagination/list-sort-direction';
import { UsersActionsService } from '../services/users-actions.service';
import { UsersActionsDataSource } from '../data-source/users-actions.datasource';
import { MatPaginator } from '@angular/material/paginator';
import { AuditEntry } from '../models/audit-entry';
import { SystemActions } from '../models/system-actions';

@Component({
  selector: 'ldm-users-actions-list',
  templateUrl: './users-actions-list.component.html',
  styleUrls: ['./users-actions-list.component.scss']
})
export class UsersActionsListComponent {
  
  constructor(private usersActionsService: UsersActionsService) {}

  displayedColumns = ["actionDateTime", "userId", "action","id"]//, /*"sujectId",*/"oldData", "newData"];
  pageSizeOptions = [5, 10, 20, 30, 50];
  sort: Sort = {
    active: 'name',
    direction: 'asc'
  }
  dataSource = new UsersActionsDataSource(
    this.usersActionsService,
    {
      pagingParameters: {
        pageNumber: 1,
        pageSize: this.pageSizeOptions[0],
        sortColumn:this.displayedColumns[0],
        sortDirection: ListSortDirection.Descending
      },
      term: '',
      userId: '',
      endDate: undefined,
      startDate: undefined
    }
  );
  @ViewChild('paginator') paginator!: MatPaginator;

  onRefreshListClick() {
    this.reloadView();
  }

  onSearch(searchParams: any) {
    this.usersActionsService.onSearch(searchParams);
    this.dataSource.render(
      () => !this.paginator.hasPreviousPage(),
      () => this.paginator.firstPage());
  }

  //onDownloadClick(format: string) {
    //this.usersActionsService.downloadFile(format);
  //}

  reloadView() {
    window.location.reload();
  }

  get containsData$() {
    return this.usersActionsService
                .onUsersActionsDataRetrieve$;
  }

  shouldDisplayActionDetails(auditEntry: AuditEntry) {
      return [SystemActions.BulkLeadRegistration,
              SystemActions.LeadRegistration,
              SystemActions.LeadDataUpdate,
              SystemActions.LeadExclusion]
                .indexOf(auditEntry.action) > -1;
  }

  onViewActionDetailsClick(auditEntry: AuditEntry) {
    this.usersActionsService.displayUserActionDetails(auditEntry);
  }
}
