import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable } from "@angular/material/table";
import { ListLeadsDataSource } from "./list-leads.datasource";
import { LeadsService } from "src/app/leads/shared/services/leads.service";
import { NotificationStickerService } from "src/app/shared/ui/widgets/notification-sticker/notification-sticker.service";
import { Lead } from "src/app/leads/shared/models/lead";
import { PromptService } from "src/app/shared/ui/widgets/prompt-dialog/prompt.service";
import { OneTimePasswordService } from "src/app/core/security/authorization/components/one-time-password/one-time-password.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "ldm-list-leads",
  templateUrl: "./list-leads.component.html",
  styleUrls: ["./list-leads.component.scss"],
})
export class ListLeadsComponent implements AfterViewInit {
  constructor(
    private leadsService: LeadsService,
    private notificationStickerService: NotificationStickerService,
    private promptService: PromptService,
    private otpService: OneTimePasswordService
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
      "razaoSocial"
    );
  }

  onRefreshListClick() {
    this.reloadView();
  }

  onDeleteItemClick(lead: Lead) {
    this.promptService.openYesNoDialog(
      `Deseja realmente remover o lead '${lead.razaoSocial}'?`,
      () => { this.removeLead(lead); },
      () => {},
      "Confirmação de exclusão"
    );
  }

  removeLead(lead: Lead) {
    this.leadsService
            .removeLead(lead.id!, lead.revision!)
            .subscribe({
              next: () => {
                this.notificationStickerService.show("Lead removido com sucesso.");

                this.reloadView();
              },
              error: (err) => {
                console.log(err);
                this.otpService.setMessage('Fudeu!');
                if (err.statusCode == environment.oneTimePassword.otpChallengeStatusCode) {
                  this.otpService.openDialog(() => {
                    this.removeLead(lead); });
                }
                else if (err.statusCode == environment.oneTimePassword.otpInvalidStatusCode) {
                  this.otpService.openDialog(() => { this.removeLead(lead); });
                }
              }
            });
  }

  reloadView() {
    window.location.reload();
  }
}
