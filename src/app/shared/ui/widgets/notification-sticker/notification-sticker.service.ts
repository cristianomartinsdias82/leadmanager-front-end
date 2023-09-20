import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageTypes } from '../../notification/message-types';

@Injectable({
  providedIn: 'root'
})
export class NotificationStickerService {

  constructor(private snackBar: MatSnackBar) { }

  show(message: string, messageType = MessageTypes.Success) {
    this.snackBar.open(
      message,
      'Close',
      {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: messageType == MessageTypes.Success ? ['success-message'] : ['error-message']
      });
  }
}