import { Injectable } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { PromptService } from "src/app/shared/ui/widgets/prompt-dialog/prompt.service";
import { OneTimePasswordComponent } from "./one-time-password.component";
import { OneTimePasswordComponentData } from "./one-time-password-component-data";
import { environment } from "src/environments/environment";
import { BehaviorSubject, Observable, Subject, mergeMap, of } from "rxjs";
import { ApplicationResponse } from "src/app/shared/core/api-response/application-response";
import { Permissions } from "../../../permissions";
import { Timer } from "./timer.model";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class OneTimePasswordService {

  constructor(
    private promptService: PromptService,
    private httpClient: HttpClient) {

  }

  private oneTimePasswordDialogRef: MatDialogRef<OneTimePasswordComponent> = null!;

  private messageSubject = new Subject<string>();
  public message$ = this.messageSubject.asObservable();

  private codeSubject = new BehaviorSubject<string>('');
  public code$ = this.codeSubject.asObservable();

  private informedCode = '';
  private requestedResource = '';

  private onSendCodeRequest: () => void = null!;

  private remainingTime?:Timer = null!;

  reset() {
    this.informedCode = '';
    this.requestedResource = '';
    this.remainingTime = null!;
    this.codeSubject.next('');
    this.messageSubject.next('');
    this.onSendCodeRequest = null!
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

  openDialog(onSendCodeRequest: () => void, resource: string): Observable<void> {

    if (!!this.oneTimePasswordDialogRef) {
      this.oneTimePasswordDialogRef.close();
    }

    this.onSendCodeRequest = onSendCodeRequest;
    this.requestedResource = resource;

    this.oneTimePasswordDialogRef = this.promptService.openDialog<OneTimePasswordComponent, OneTimePasswordComponentData>(
      OneTimePasswordComponent,
      {
        countdownDigitCount: environment.oneTimePassword.countdownDigitCount,
        expirationTimeInSeconds: environment.oneTimePassword.expirationTimeInSeconds,
        remainingTime: this.getRemainingTime(),
        onSend: (input: string) => this.onSend(input),
        onResendCodeRequested: () => this.onResendCode(),
        onExpiredCodeResponse: () => null!,
        onInvalidCodeResponse: () => null!
      },
      environment.oneTimePassword.dialogWidthInPercent
    );
    
    return this.oneTimePasswordDialogRef.afterOpened();
  }

  onSend(code: string): Observable<ApplicationResponse<boolean>> {

    this.informedCode = code;
    this.onSendCodeRequest();

    return of({
      success: true,
    });
  }

  onResendCode(): Observable<ApplicationResponse<boolean>> {

    return this.httpClient.post(`${environment.apiUrl}/one-time-password`, { resource : Permissions.Delete })
                          .pipe(
                            mergeMap(_ => {
                              this.remainingTime = null!;
                              this.openDialog(this.onSendCodeRequest, this.requestedResource);

                              return of({ success : false })
                            })
                          );
  }
}
