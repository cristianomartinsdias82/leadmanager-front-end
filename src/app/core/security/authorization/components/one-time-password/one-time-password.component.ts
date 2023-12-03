import { Component, Inject, OnInit } from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { OneTimePasswordComponentData } from "./one-time-password-component-data";
import { Timer } from "./timer.model";
import { OneTimePasswordService } from "./one-time-password.service";
import { ErrorMessages } from "src/app/leads/shared/messages/error-messages";

@Component({
  selector: "ldm-one-time-password",
  templateUrl: "./one-time-password.component.html",
  styleUrls: ["./one-time-password.component.scss"],
})
export class OneTimePasswordComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<OneTimePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public state: OneTimePasswordComponentData,
    private formBuilder: FormBuilder,
    private oneTimePasswordService: OneTimePasswordService) {

  }

  readonly DigitInputControlsName = 'digitInputs';
  oneTimePasswordForm!: FormGroup;
  possibleDigitKeyCodes = [
    (keyCode: number) => [8, 9].includes(keyCode),
    (keyCode: number) => keyCode >= 48 && keyCode <= 57,
    (keyCode: number) => keyCode >= 96 && keyCode <= 105,
  ];
  timeParts: Timer = null!;
  expirationTime: Date = null!;
  timedOut = false;

  public get message$() {
    return this.oneTimePasswordService.message$;
  }

  ngOnInit() {
    this.configForm();
    this.setExpirationTime();
  }

  setExpirationTime() {

    this.timedOut = false;
    this.expirationTime = new Date();
    this.expirationTime.setSeconds(this.expirationTime.getSeconds() +
                                  (this.state?.remainingTime ? (this.state?.remainingTime.minutes * 60) + this.state?.remainingTime.seconds : this.state.expirationTimeInSeconds));

  }

  configForm() {
    const controls: AbstractControl[] = [];
    for (let index = 0; index < this.state.countdownDigitCount; index++) {
      controls.push(this.formBuilder.control(''));
    }

    this.oneTimePasswordForm = this.formBuilder.group({
      digitInputs: this.formBuilder.array(controls),
    });

    this.oneTimePasswordService.code$.subscribe(code => {
      document.getElementById('btnPostCode')?.focus();
    });
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
      next: (_) => this.state.onSend(this.getInsertedCode())
    });
    this.dialogRef.close();
  }

  onResendCodeClick() {

    this.state
          .onResendCodeRequested()
          .subscribe();
          
  }

  onInputChange(e: any, inputIndex: number) {

    const isValidDigit = this.possibleDigitKeyCodes.some(expr => expr(e.keyCode));
    if (!isValidDigit) {
      e.target.value = '';
      e.preventDefault();
      return false;
    }

    if (e.target.value.trim().length > 0) {

      if (inputIndex < this.state.countdownDigitCount - 1) {
        this.setFocusOn(inputIndex + 1);
      } else {
        this.oneTimePasswordService.setInformedCode(this.getInsertedCode());
      }
    }

    return true;
  }

  onCountdownComplete() {
    this.timedOut = true;
    this.oneTimePasswordService.setMessage(ErrorMessages.TempoEnvioLimiteExcedido);
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
