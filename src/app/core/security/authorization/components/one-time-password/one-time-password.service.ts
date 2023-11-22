import { Injectable } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { PromptService } from "src/app/shared/ui/widgets/prompt-dialog/prompt.service";
import { OneTimePasswordComponent } from "./one-time-password.component";
import { OneTimePasswordComponentData } from "./one-time-password-component-data";
import { environment } from "src/environments/environment";
import { Observable, of } from "rxjs";
import { ApplicationResponse } from "src/app/shared/core/api-response/application-response";
import { Permissions } from "../../../permissions";

@Injectable({
  providedIn: "root"
})
export class OneTimePasswordService {
  constructor(private promptService: PromptService) {}

  private oneTimePasswordDialogRef: MatDialogRef<OneTimePasswordComponent> =
    null!;

  init() {
    if (!!this.oneTimePasswordDialogRef) {
      this.oneTimePasswordDialogRef.close();
    }

    setTimeout(() => {
      this.oneTimePasswordDialogRef = this.promptService.openDialog<OneTimePasswordComponent,OneTimePasswordComponentData>(
        OneTimePasswordComponent,
        {
          digitCount: environment.oneTimePassword.digitCount,
          lifeSpanInSeconds: environment.oneTimePassword.lifeSpanInSeconds,
          requestedPermission: Permissions.Delete,
          onSend: this.onSend,
          onResendCodeRequested: () => {
            return this.onResendCode();
          },
        },
        environment.oneTimePassword.dialogWithInPercent
      );
    }, 20);
  }

  onSend(input: string): Observable<ApplicationResponse<boolean>> {
    console.log("sending", input);
    return of({
      success: true,
    });
  }

  onResendCode(): Observable<ApplicationResponse<boolean>> {
    this.init();
    console.log("sending new code");
    return of({
      success: true,
    });
  }
}
