import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { filter, map, startWith, switchMap } from "rxjs";
import { Lead } from "src/app/leads/common/models/lead";
import { LeadsService } from "src/app/leads/common/services/leads.service";
import { PromptService } from "src/app/common/ui/notification/prompt.service";
import { NotificationStickerService } from "src/app/common/ui/widgets/notification-sticker/notification-sticker.service";
import { ApplicationResponse } from "src/app/common/application-response";
import { PagedList } from "src/app/common/paged-list";
import { ListSortDirection } from "src/app/common/list-sort-direction";

@Component({
  selector: "ldm-list-leads",
  templateUrl: "./list-leads.component.html",
  styleUrls: ["./list-leads.component.scss"],
})
export class ListLeadsComponent implements AfterViewInit {
  constructor(
    private router: Router,
    private leadsService: LeadsService,
    private notificationStickerService: NotificationStickerService,
    private promptService: PromptService
  ) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Lead>;

  dataSource = new MatTableDataSource<Lead>();
  displayedColumns = ["cnpj", "razaoSocial", "cep", "estado", "acoes"];
  leads: Lead[] = [];
  itemCount = 0;
  sortColumn = this.displayedColumns[1];
  sortDirection = ListSortDirection.Ascending;

  ngAfterViewInit() {

    //https://www.angularjswiki.com/material/mat-table-serverside-pagination/
    setTimeout(() =>{
      this.dataSource.paginator = this.paginator;
      this.paginator.page.pipe(

        startWith({}),
        switchMap(() =>
            this.leadsService.fetch({
              pageNumber: this.paginator.pageIndex + 1,
              pageSize: this.paginator.pageSize,
              sortColumn: this.sortColumn,
              sortDirection: this.sortDirection })
        ),
        map((response: ApplicationResponse<PagedList<Lead>>) => {
          this.itemCount = response.data!.itemCount;
          return response.data!.items;
        })
      ).subscribe((leads:Lead[]) => {
        this.leads = leads;
        this.dataSource = new MatTableDataSource(leads);
      });
    
      this.sort.sortChange.pipe(

        filter((sort:Sort) => ['asc','desc'].includes(sort.direction)),
        switchMap((sort: Sort) => {
            this.sortColumn = sort.active;
            this.sortDirection = sort.direction === 'asc' ? ListSortDirection.Ascending : ListSortDirection.Descending;

            return this.leadsService.fetch({
              pageNumber: this.paginator.pageIndex + 1,
              pageSize: this.paginator.pageSize,
              sortColumn: this.sortColumn,
              sortDirection: this.sortDirection
            })
        }),
        map((response: ApplicationResponse<PagedList<Lead>>) => {
          this.itemCount = response.data!.itemCount;
          return response.data!.items;
        })
      ).subscribe((leads:Lead[]) => {
        this.leads = leads;
        this.dataSource = new MatTableDataSource(leads);
      });
    },0);
    
  }

  onRefreshListClick() {
    this.reloadView();
  }

  onDeleteItemClick(lead: Lead) {
    this.promptService.openYesNoDialog(
      `Deseja realmente remover o lead '${lead.razaoSocial}'?`,
      () => {
        this.leadsService.remove(lead!.id!, lead!.revision!).subscribe({
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
}
