import { AfterViewInit, Component, OnDestroy, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ListLeadsDataSource } from "./list-leads.datasource";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable } from "@angular/material/table";
import { Lead } from "src/app/leads/common/models/lead";
import { LeadsService } from "src/app/leads/common/services/leads.service";
import { PromptService } from "src/app/common/ui/widgets/prompt-dialog/prompt.service";
import { NotificationStickerService } from "src/app/common/ui/widgets/notification-sticker/notification-sticker.service";
import { ApplicationResponse } from "src/app/common/application-response";
import { Subscription } from "rxjs";
import { PagedList } from "src/app/common/paged-list";
import { PagingParameters } from "src/app/common/paging-parameters";
import { ListSortDirection } from "src/app/common/list-sort-direction";

@Component({
  selector: "ldm-list-leads",
  templateUrl: "./list-leads.component.html",
  styleUrls: ["./list-leads.component.scss"],
})
export class ListLeadsComponent implements AfterViewInit, OnDestroy {
  constructor(
    private router: Router,
    private leadsService: LeadsService,
    private notificationStickerService: NotificationStickerService,
    private promptService: PromptService
  ) {
    this.initDataSource();
  }

  initDataSource() {
    const self = this;
    this.dataSource = new ListLeadsDataSource();
    this.dataSource.pageChanged.subscribe(function(paginationArgs: PagingParameters) { self.loadData(paginationArgs) }.bind(this));
    this.dataSource.sorted.subscribe(function(paginationArgs: PagingParameters) { self.loadData(paginationArgs) }.bind(this));
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Lead>;

  dataSource: ListLeadsDataSource = null!;
  displayedColumns = ["cnpj", "razaoSocial", "cep", "estado", "acoes"];
  leadsServiceSubscription: Subscription = Subscription.EMPTY;
  leads: Lead[] = [];

  ngAfterViewInit() {
    this.loadData({
      pageNumber: 1,
      pageSize: 10,
      sortColumn: 'razaoSocial',
      sortDirection: ListSortDirection.Ascending
    });
  }

  onRefreshListClick() {
    this.reloadView();
  }

  onDeleteItemClick(lead: Lead) {
    this.promptService.openDialog(
      `Deseja realmente remover o lead '${lead.razaoSocial}'?`,
      () => {
        this.leadsService.remove(lead!.id!).subscribe({
          next: () => {
            this.notificationStickerService.show("Lead removido com sucesso.");

            this.reloadView();
          },
        });
      },
      () => {},
      "Confirmação de exclusão"
    );
  }

  reloadView() {
    //https://stackoverflow.com/questions/40983055/how-to-reload-the-current-route-with-the-angular-2-router
    this.router
      .navigateByUrl("/", { skipLocationChange: true })
      .then(() => this.router.navigate(["/leads"]));
  }

  loadData(pagingParameters: PagingParameters) {
    //https://blog.simplified.courses/angular-expression-changed-after-it-has-been-checked-error/ (see "Real-life use cases and solving the issue" topic)
    setTimeout(() => {
      this.initDataSource();
      this.leadsServiceSubscription = this.leadsService
        .fetch(pagingParameters)
        .subscribe((response: ApplicationResponse<PagedList<Lead>>) => {

          this.dataSource.data = response.data!.items;
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.table.dataSource = this.dataSource;

          this.dataSource.setPaginatorItemCount(response.data!.itemCount);
          this.leads = this.dataSource.data;
          
        });
    }, 0);
  }

  ngOnDestroy() {
    this.leadsServiceSubscription.unsubscribe();
  }
}
