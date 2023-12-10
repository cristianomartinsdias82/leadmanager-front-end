import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatDialogRef } from "@angular/material/dialog";
import { environment } from "src/environments/environment";
import { BehaviorSubject, Observable, Subject, mergeMap, of } from "rxjs";
import { ApplicationResponse } from "src/app/shared/core/api-response/application-response";
import { Timer } from "./timer.model";
import { PromptService } from "src/app/shared/ui/widgets/prompt-dialog/prompt.service";
import { OneTimePasswordComponent } from "./one-time-password.component";
import { OneTimePasswordDialogParameters } from "./one-time-password-dialog-parameters";
import { OneTimePasswordComponentConfiguration } from "./one-time-password-component-configuration";

@Injectable({ providedIn: "root" })
export class OneTimePasswordService {

  constructor(private promptService: PromptService, private httpClient: HttpClient)
  {

  }

  private oneTimePasswordDialogRef: MatDialogRef<OneTimePasswordComponent> = null!;
  private dialogParameters?: OneTimePasswordDialogParameters;

  private messageSubject = new Subject<string>();
  public message$ = this.messageSubject.asObservable();

  private codeSubject = new BehaviorSubject<string>('');
  public code$ = this.codeSubject.asObservable();

  private remainingTime?:Timer = null!;

  private informedCode = '';  

  resetState() {

    this.informedCode = '';
    
    this.remainingTime = null!;
    this.codeSubject.next('');
    this.messageSubject.next('');
    this.dialogParameters = undefined;

  }

  setRemainingTime(time: Timer) {
    this.remainingTime = time;
  }

  getRemainingTime() {
    return this.remainingTime;
  }

  getInformedCode(clearOnReturn = true) {
    const code = this.informedCode;

    if (clearOnReturn) {
      this.informedCode = '';
    }

    return code;
  }

  setInformedCode(code: string) {
    this.codeSubject.next(code);
  }

  setMessage(message:string) {
    this.messageSubject.next(message);
  }

  openDialog(dialogParameters: OneTimePasswordDialogParameters): Observable<void> {

    if (!!this.oneTimePasswordDialogRef) {
      this.oneTimePasswordDialogRef.close();
    }

    this.dialogParameters = dialogParameters;
    
    this.oneTimePasswordDialogRef = this.promptService.openDialog<OneTimePasswordComponent, OneTimePasswordComponentConfiguration>(
      OneTimePasswordComponent,
      {
        countdownDigitCount: environment.oneTimePassword.countdownDigitCount,
        expirationTimeInSeconds: environment.oneTimePassword.expirationTimeInSeconds,
        remainingTime: this.getRemainingTime(),
        onSend: (input: string) => this.onSend(input),
        onResendCodeRequested: () => this.onResendCode()
      },      
      environment.oneTimePassword.dialogWidthInPercent
    );
    
    return this.oneTimePasswordDialogRef.afterOpened();
  }

  onSend(code: string): Observable<ApplicationResponse<boolean>> {

    this.informedCode = code;
    this.dialogParameters?.onSendCodeRequest();

    return of({ success: true });
  }

  onResendCode(): Observable<ApplicationResponse<boolean>> {

    return this.httpClient.post(`${environment.apiUrl}/one-time-password`, { resource : this.dialogParameters!.resource })
                          .pipe(
                            mergeMap(_ => {
                              this.remainingTime = null!;
                              this.openDialog(this.dialogParameters!);

                              return of({ success : false })
                            })
                          );
  }
}
