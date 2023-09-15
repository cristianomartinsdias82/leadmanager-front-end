import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable, } from "@angular/material/table";
import { Lead } from "src/app/leads/common/models/lead";
import { LeadsService } from "src/app/leads/common/services/leads.service";
import { PromptService } from "src/app/common/ui/notification/prompt.service";
import { NotificationStickerService } from "src/app/common/ui/widgets/notification-sticker/notification-sticker.service";
import { ListLeadsDataSource } from "./list-leads.datasource";

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

  displayedColumns = ["cnpj", "razaoSocial", "cep", "estado", "acoes"];
  listLeadsDataSource: ListLeadsDataSource = null!;

  ngAfterViewInit() {

    this.listLeadsDataSource = new ListLeadsDataSource(
      this.leadsService,
      this.table,
      this.paginator,
      this.sort,
      'razaoSocial');

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
