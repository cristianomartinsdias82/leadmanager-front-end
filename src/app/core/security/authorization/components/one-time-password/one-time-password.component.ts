import { Component, Inject, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { OneTimePasswordComponentData } from "./one-time-password-component-data";
import { Timer } from "./timer.model";
import { OneTimePasswordService } from "./one-time-password.service";

@Component({
  selector: "ldm-one-time-password",
  templateUrl: "./one-time-password.component.html",
  styleUrls: ["./one-time-password.component.scss"]
})
export class OneTimePasswordComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<OneTimePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OneTimePasswordComponentData,
    private formBuilder: FormBuilder,
    private oneTimePasswordService: OneTimePasswordService
  ) {
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
    return this.oneTimePasswordService.onMessageSet$;
  }

  ngOnInit() {
    this.configForm();
    this.setExpirationTime();
  }

  setExpirationTime() {
    this.timedOut = false;
    this.expirationTime = new Date();
    this.expirationTime.setSeconds(this.expirationTime.getSeconds() + this.data.lifeSpanInSeconds );
  }

  configForm() {
    const controls: AbstractControl[] = [];
    for (let index = 0; index < this.data.digitCount; index++) {
      controls.push(this.formBuilder.control(''));
    }

    this.oneTimePasswordForm = this.formBuilder.group({
      digitInputs: this.formBuilder.array(controls),
    });
  }

  onSendCodeClick() {
    this.dialogRef.beforeClosed().subscribe({
      next: (_) => this.data.onSend(this.getInsertedCode()),
    });
    this.dialogRef.close();
  }

  onResendCodeClick() {

    this.data
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

      if (inputIndex < this.data.digitCount - 1) {
        this.setFocusOn(inputIndex + 1);
      } else {
        
        document.getElementById('btnPostCode')?.focus();
      }
    }

    return true;
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

  onCountdownComplete() {
    this.timedOut = true;
  }
  
  onCountdownUpdate(timer: Timer) {
    this.timeParts = timer;
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

  get remainingTime() {
    return (this.timeParts.minutes < 10 ? `0${this.timeParts.minutes}` : this.timeParts.minutes) + ':' + (this.timeParts.seconds < 10 ? `0${this.timeParts.seconds}` : this.timeParts.seconds);
  }
}
