import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { LeadMaintenanceTabs } from "./components/lead-maintenance-tabs.enum";
import { OnLeave } from "src/app/shared/ui/navigation/on-leave";
import { NotificationStickerService } from "src/app/shared/ui/widgets/notification-sticker/notification-sticker.service";
import { PromptService } from "src/app/shared/ui/widgets/prompt-dialog/prompt.service";

@Component({
  selector: "ldm-maintain-lead",
  templateUrl: "./maintain-lead.component.html",
  styleUrls: ["./maintain-lead.component.scss"],
})
export class MaintainLeadComponent implements OnLeave {
  private skipLeaveConfirmationPrompt = true;
  activeTab: LeadMaintenanceTabs = LeadMaintenanceTabs.BulkInsert;

  constructor(
    private router: Router,
    private promptService: PromptService,
    private notificationStickerService: NotificationStickerService
  ) {}

  onCancelOperation(skipLeaveConfirmationPrompt: boolean) {
    this.skipLeaveConfirmationPrompt = skipLeaveConfirmationPrompt;

    this.redirectToMain();
  }

  onOperationSuccessful() {
    this.skipLeaveConfirmationPrompt = true;

    this.notificationStickerService.show("Dados salvos com sucesso!");

    this.redirectToMain();
  }

  onLeadSelected() {
    this.activeTab = LeadMaintenanceTabs.ManualRegistration;
  }

  onLeave(): boolean | Observable<boolean> {
    if (this.skipLeaveConfirmationPrompt) {
      return true;
    }

    this.promptService.openYesNoDialog(
      "Você tem dados que ainda não foram salvos. Deseja realmente sair desta página? Todos os dados serão perdidos!",
      () => {
        this.skipLeaveConfirmationPrompt = true;
        this.redirectToMain();
      },
      () => {},
      "Sair desta página"
    );

    return false;
  }

  private redirectToMain() {
    this.router.navigate(["/leads"]);
  }
}
