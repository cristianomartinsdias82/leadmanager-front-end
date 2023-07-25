import {
  Component
} from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { OnLeave } from "src/app/common/ui/navigation/on-leave";
import { PromptService } from "src/app/common/ui/widgets/prompt-dialog/prompt.service";


@Component({
  selector: "ldm-maintain-lead",
  templateUrl: "./maintain-lead.component.html",
  styleUrls: ["./maintain-lead.component.scss"],
})
export class MaintainLeadComponent implements OnLeave {

  private skipLeaveConfirmation = false;

  constructor(
    private router: Router,
    private promptService: PromptService) {

  }

  onCancelOperation(skipLeaveConfirmation: boolean) {
    this.skipLeaveConfirmation = skipLeaveConfirmation;
    
    this.router.navigate(["/"]);
  }

  onLeave(): boolean | Observable<boolean> {

    if (this.skipLeaveConfirmation) {
      return true;
    }

    this.promptService.openDialog(
      "Você tem dados que ainda não foram salvos. Deseja realmente sair desta página? Todos os dados serão perdidos!",
      () => {
        //this.bulkInsertLeadForm.markAsPristine(); <<<<<<<<<<
        this.router.navigate(["leads"]);
      },
      () => {},
      "Sair desta página"
    );

    return false;
  }
}