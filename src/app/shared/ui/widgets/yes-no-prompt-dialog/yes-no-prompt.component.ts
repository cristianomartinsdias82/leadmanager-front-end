import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { YesNoPromptParameters } from './yes-no-prompt-parameters';

@Component({
  selector: 'ldm-prompt',
  templateUrl: './yes-no-prompt.component.html',
  styleUrls: ['./yes-no-prompt.component.scss']
})
export class YesNoPromptComponent {

  constructor(
    public dialogRef: MatDialogRef<YesNoPromptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: YesNoPromptParameters,
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
