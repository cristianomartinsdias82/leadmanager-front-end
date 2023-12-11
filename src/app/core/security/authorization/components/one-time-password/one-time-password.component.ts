import { Component, Inject, OnInit } from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Timer } from "./timer.model";
import { OneTimePasswordService } from "./one-time-password.service";
import { ErrorMessages } from "src/app/leads/shared/messages/error-messages";
import { OneTimePasswordComponentConfiguration } from "./one-time-password-component-configuration";

enum AllowedNonDigitKeyCodes {
  Backspace = 8,
  HorizontalTab = 9
};

@Component({
  selector: "ldm-one-time-password",
  templateUrl: "./one-time-password.component.html",
  styleUrls: ["./one-time-password.component.scss"],
})
export class OneTimePasswordComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<OneTimePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public configState: OneTimePasswordComponentConfiguration,
    private formBuilder: FormBuilder,
    private oneTimePasswordService: OneTimePasswordService) {
  }

  DigitInputControlsName = 'digitInputs';
  PostCodeButtonId = 'btnPostCode';

  allowedKeyCodes = [
    (keyCode: number) => [AllowedNonDigitKeyCodes.Backspace, AllowedNonDigitKeyCodes.HorizontalTab].includes(keyCode),
    (keyCode: number) => keyCode >= 48 && keyCode <= 57,
    (keyCode: number) => keyCode >= 96 && keyCode <= 105
  ];
  oneTimePasswordForm!: FormGroup;
  timeParts: Timer = null!;
  expirationTime: Date = null!;
  timedOut = false;

  public get message$() {
    return this.oneTimePasswordService.message$;
  }

  ngOnInit() {
    this.configForm();
    this.setExpirationTime();
    this.configAbandonBehavior();
  }

  configAbandonBehavior() {
    this.dialogRef.backdropClick().subscribe({ next: () => this.oneTimePasswordService.resetState() });
  }

  configForm() {
    const controls: AbstractControl[] = [];
    for (let index = 0; index < this.configState.countdownDigitCount; index++) {
      controls.push(this.formBuilder.control(''));
    }

    this.oneTimePasswordForm = this.formBuilder.group({
      digitInputs: this.formBuilder.array(controls),
    });

    this.oneTimePasswordService.code$.subscribe(code => {
      document.getElementById(this.PostCodeButtonId)?.focus();
    });
  }

  setExpirationTime() {

    this.timedOut = false;
    this.expirationTime = new Date();
    this.expirationTime.setSeconds(this.expirationTime.getSeconds() +
                                  (this.configState?.remainingTime ? (this.configState?.remainingTime.minutes * 60) + this.configState?.remainingTime.seconds : this.configState.expirationTimeInSeconds));

  }

  setFocusOn(inputIndex: number) {
    this.getInputElement(inputIndex).focus();
  }

  getInputElement(inputIndex: number) {
    return document.getElementsByName(this.DigitInputControlsName).item(inputIndex) as HTMLInputElement;
  }

  getInsertedCode() {
    let code = '';
    document.getElementsByName(this.DigitInputControlsName).forEach(elem => code += ((elem as HTMLInputElement).value));

    return code;
  }

  onSendCodeClick() {

    this.dialogRef.beforeClosed().subscribe({
      next: () => this.configState.onSend(this.getInsertedCode())
    });
    this.dialogRef.close();
  }

  onResendCodeClick() {

    this.configState
          .onResendCodeRequested()
          .subscribe();
          
  }

  onInputChange(e: any, inputIndex: number) {

    //Block if digit is not allowed
    if (!this.allowedKeyCodes.some(expr => expr(e.keyCode))) {
      e.target.value = '';

      return false;
    }

    if (e.target.value.trim().length > 0) {

      if (inputIndex < this.configState.countdownDigitCount - 1) {
        this.setFocusOn(inputIndex + 1);
      } else {
        this.oneTimePasswordService.setInformedCode(this.getInsertedCode());
      }
    }

    return true;
  }

  onCountdownComplete() {
    this.timedOut = true;
    this.oneTimePasswordService.setMessage(ErrorMessages.SendingTimeLimitExceeded);
  }
  
  onCountdownUpdate(timer: Timer) {
    this.timeParts = timer;
    this.oneTimePasswordService.setRemainingTime(timer);
  }

  get allCodeFieldsAreFilledIn() {
    let allFieldsSet = true;
    const digitInputs = document.getElementsByName(this.DigitInputControlsName);
    for (let index = 0; index < digitInputs.length; index++) {
      if ((digitInputs[index] as HTMLInputElement).value.length === 0){
        allFieldsSet = false;
        break;
      }
    }
    
    return !this.timedOut && allFieldsSet;
  }

  get digitInputs() {
    return this.oneTimePasswordForm.get(this.DigitInputControlsName) as FormArray;
  }

  get remainingFormattedTime() {
    if (this.timeParts) {
      return (this.timeParts.minutes < 10 ? `0${this.timeParts.minutes}` : this.timeParts.minutes) + ':' + (this.timeParts.seconds < 10 ? `0${this.timeParts.seconds}` : this.timeParts.seconds);
    }
    
    return null;
  }
}
