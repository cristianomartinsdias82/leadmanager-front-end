import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PromptParameters } from './prompt-parameters';

@Component({
  selector: 'ldm-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: []
})
export class PromptComponent {

  constructor(
    public dialogRef: MatDialogRef<PromptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PromptParameters,
  ) {}

  onYesClick()
  {
    this.data.onYesClick?.call(arguments);
  }

  onNoClick()
  {
    this.data.onNoClick?.call(arguments);
  }
}