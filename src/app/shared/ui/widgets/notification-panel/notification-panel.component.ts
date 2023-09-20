import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationPanelParameters } from './notification-panel-parameters';

@Component({
  selector: 'ldm-notification-panel',
  templateUrl: './notification-panel.component.html',
  styleUrls: ['./notification-panel.component.scss']
})
export class NotificationPanelComponent {

  constructor(
    public dialogRef: MatDialogRef<NotificationPanelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NotificationPanelParameters
  ) {}

  onCloseClick() {
    this.data.onCloseClick?.call(arguments);
  }
}