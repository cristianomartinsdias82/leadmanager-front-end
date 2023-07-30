import { Component} from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { OnLeave } from "src/app/common/ui/navigation/on-leave";
import { NotificationStickerService } from "src/app/common/ui/widgets/notification-sticker/notification-sticker.service";
import { PromptService } from "src/app/common/ui/widgets/prompt-dialog/prompt.service";

@Component({
  selector: "ldm-maintain-lead",
  templateUrl: "./maintain-lead.component.html",
  styleUrls: ["./maintain-lead.component.scss"]
})
export class MaintainLeadComponent implements OnLeave {

  private skipDisplayLeaveConfirmation = true;

  constructor(
    private router: Router,
    private promptService: PromptService,
    private notificationStickerService: NotificationStickerService) {

  }

  onCancelOperation(skipDisplayLeaveConfirmation: boolean) {
    this.skipDisplayLeaveConfirmation = skipDisplayLeaveConfirmation;
    
    this.redirectToMain();
  }

  onOperationSuccessful() {
    this.skipDisplayLeaveConfirmation = true;

    this.notificationStickerService.show('Dados salvos com sucesso!');

    this.redirectToMain();
  }

  onLeave(): boolean | Observable<boolean> {

    if (this.skipDisplayLeaveConfirmation) {
      return true;
    }

    this.promptService.openDialog(
      "Você tem dados que ainda não foram salvos. Deseja realmente sair desta página? Todos os dados serão perdidos!",
      () => {
        this.skipDisplayLeaveConfirmation = true;
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