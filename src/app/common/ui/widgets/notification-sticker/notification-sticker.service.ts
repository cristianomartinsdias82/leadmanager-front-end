import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageType } from '../prompt-dialog/message-type';

@Injectable({
  providedIn: 'root'
})
export class NotificationStickerService {

  constructor(private snackBar: MatSnackBar) { }

  show(message: string, messageType = MessageType.Success) {
    this.snackBar.open(
      message,
      'Close',
      {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: messageType == MessageType.Success ? ['success-message'] : ['error-message']
      });
  }
}