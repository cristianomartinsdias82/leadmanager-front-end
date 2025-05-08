import { Sort } from '@angular/material/sort';
import { Component } from '@angular/core';
import { ListSortDirection } from 'src/app/shared/core/pagination/list-sort-direction';
import { UsersActionsService } from '../services/users-actions.service';
import { UsersActionsDataSource } from '../data-source/users-actions.datasource';

@Component({
  selector: 'ldm-users-actions-list',
  templateUrl: './users-actions-list.component.html',
  styleUrls: ['./users-actions-list.component.scss']
})
export class UsersActionsListComponent {
  
  constructor(private usersActionsService: UsersActionsService) {}

  displayedColumns = ["actionDateTime", "userId", "action", /*"sujectId",*/"oldData", "newData"];
  pageSizeOptions = [5, 10, 20, 30, 50];
  sort: Sort = {
    active: 'name',
    direction: 'asc'
  }
  dataSource = new UsersActionsDataSource(
    this.usersActionsService,
    this.displayedColumns[0],
    ListSortDirection.Descending,
    1,
    this.pageSizeOptions[0]
  );

  onRefreshListClick() {
    this.reloadView();
  }

  onSearch(query: any) {
    this.usersActionsService.onSearch(query);
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
}
