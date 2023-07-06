import {
  AfterViewInit,
  Component,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { ListLeadsDataSource } from "./list-leads.datasource";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable } from "@angular/material/table";
import { Lead } from "src/app/leads/common/models/lead";
import { LeadsService } from "src/app/leads/common/services/leads.service";
import { PromptService } from "src/app/common/ui/widgets/prompt-dialog/prompt.service";
import { NotificationService } from "src/app/common/ui/widgets/notification-dialog/notification.service";
import { ApplicationResponse } from "src/app/common/application-response";
import { Subscription } from "rxjs";

@Component({
  selector: "ldm-list-leads",
  templateUrl: "./list-leads.component.html",
  styleUrls: ["./list-leads.component.scss"],
})
export class ListLeadsComponent implements AfterViewInit {
  constructor(
    private router: Router,
    private leadsService: LeadsService,
    private notificationService: NotificationService,
    private promptService: PromptService
  ) {
    this.dataSource = new ListLeadsDataSource();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Lead>;

  dataSource: ListLeadsDataSource;
  displayedColumns = ["cnpj", "razaoSocial", "cep", "estado", "acoes"];
  leadsServiceSubscription: Subscription = Subscription.EMPTY;
  leads: Lead[] = [];

  ngAfterViewInit() {
    this.configAndLoadData();
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
            this.notificationService.displayMessage(
              "Lead removido com sucesso."
            );

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

  configAndLoadData() {
    setTimeout(() => { //<<< https://blog.simplified.courses/angular-expression-changed-after-it-has-been-checked-error/ (see "Real-life use cases and solving the issue" topic)
      this.leadsServiceSubscription = this.leadsService
                                          .fetch({ page: this.paginator?.pageIndex ?? 1, itemsPerPage: this.paginator?.pageSize ?? 10 })
                                          .subscribe((response:ApplicationResponse<Lead[]>) => {
                                            this.dataSource.data = response.data!;
                                            this.dataSource.sort = this.sort;
                                            this.dataSource.paginator = this.paginator;
                                            this.table.dataSource = this.dataSource;
                                          });
      }, 0);
  }
}
