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
import { Permissions } from "src/app/core/security/permissions";
import { NotificationPanelService } from "src/app/shared/ui/widgets/notification-panel/notification-panel.service";
import { ErrorMessages } from "src/app/leads/shared/messages/error-messages";

@Component({
  selector: "ldm-list-leads",
  templateUrl: "./list-leads.component.html",
  styleUrls: ["./list-leads.component.scss"],
})
export class ListLeadsComponent implements AfterViewInit {
  constructor(
    private leadsService: LeadsService,
    private notificationStickerService: NotificationStickerService,
    private notificationPanelService: NotificationPanelService,
    private promptService: PromptService,
    private oneTimePasswordService: OneTimePasswordService
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

  //TODO: Your next assignment is to move all this messy code away from the component code. Abstract it away from here by placing it inside
  //the LeadsService class
  removeLead(lead: Lead) {
    this.leadsService
            .removeLead(lead.id!, lead.revision!)
            .subscribe({
              next: () => {
                this.notificationStickerService.show("Lead removido com sucesso.");

                this.reloadView();
              },
              error: (err) => {
                
                let message = '';
                let displayOneTimePasswordDialog = true;

                switch (err.statusCode) {
                  case environment.oneTimePassword.otpInvalidStatusCode: { message = ErrorMessages.CodigoInvalido; break; }
                  case environment.oneTimePassword.otpExpiredStatusCode: { message = ErrorMessages.CodigoInvalido; break; }
                  case environment.oneTimePassword.otpChallengeStatusCode: { message = ''; break; }
                  default: {
                    displayOneTimePasswordDialog = false;

                    //TODO: Implement a Global error handler
                    //TODO: Next, throw an error from here so the global error handler can catch and handle it more properly
                    this.notificationPanelService.show(`${ErrorMessages.ErroAoProcessarSolicitacao}. ${ErrorMessages.EntreEmContatoSuporteAdm}`, null!, null!);
                  }
                }

                if (displayOneTimePasswordDialog) {
                  
                  setTimeout(() => {
                    this.oneTimePasswordService
                          .openDialog({
                              onSendCodeRequest: () => { this.removeLead(lead); },
                              resource: Permissions.Delete
                          })
                          .subscribe(_ => this.oneTimePasswordService.setMessage(message));
                  }, 100);
                }
              }
            });
  }

  reloadView() {
    window.location.reload();
  }
}
