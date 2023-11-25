import { Injectable } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { PromptService } from "src/app/shared/ui/widgets/prompt-dialog/prompt.service";
import { OneTimePasswordComponent } from "./one-time-password.component";
import { OneTimePasswordComponentData } from "./one-time-password-component-data";
import { environment } from "src/environments/environment";
import { Observable, Subject, of } from "rxjs";
import { ApplicationResponse } from "src/app/shared/core/api-response/application-response";
import { Permissions } from "../../../permissions";

@Injectable({
  providedIn: "root"
})
export class OneTimePasswordService {
  constructor(private promptService: PromptService) {}

  private oneTimePasswordDialogRef: MatDialogRef<OneTimePasswordComponent> = null!;
  private onMessageSet = new Subject<string>();
  public onMessageSet$ = this.onMessageSet.asObservable();

  private informedCode = '';
  private afterCodeInformed: () => void = null!;

  getInformedCode(clearOnReturn = true) {
    const code = this.informedCode;

    if (clearOnReturn) {
      this.informedCode = '';
    }

    return code;
  }

  setMessage(message:string) {
    this.onMessageSet.next(message);
  }

  openDialog(onAfterCodeInformed: () => void) {

    if (!!this.oneTimePasswordDialogRef) {
      this.oneTimePasswordDialogRef.close();
    }

    this.afterCodeInformed = onAfterCodeInformed;

    setTimeout(() => {
      this.oneTimePasswordDialogRef = this.promptService.openDialog<OneTimePasswordComponent, OneTimePasswordComponentData>(
        OneTimePasswordComponent,
        {
          digitCount: environment.oneTimePassword.digitCount,
          lifeSpanInSeconds: environment.oneTimePassword.lifeSpanInSeconds,
          requestedPermission: Permissions.Delete,
          onSend: (input: string) => this.onSend(input),
          onResendCodeRequested: () => this.onResendCode()
        },
        environment.oneTimePassword.dialogWidthInPercent
      );
    }, 20);
  }

  onSend(code: string): Observable<ApplicationResponse<boolean>> {

    this.informedCode = code;
    this.afterCodeInformed();

    return of({
      success: true,
    });
  }

  onResendCode(): Observable<ApplicationResponse<boolean>> {
    console.log("sending new code");

    this.openDialog(this.afterCodeInformed);
    
    return of({
      success: true,
    });
  }
}
