import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomPromptParameters } from './custom-prompt-parameters';

@Component({
  selector: 'ldm-custom-prompt',
  templateUrl: './custom-prompt.component.html',
  styleUrls: ['./custom-prompt.component.scss']
})
export class CustomPromptComponent {

  constructor(
    public dialogRef: MatDialogRef<CustomPromptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CustomPromptParameters,
  ) {}
}
