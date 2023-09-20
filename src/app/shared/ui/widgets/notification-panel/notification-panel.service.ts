import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationPanelComponent } from './notification-panel.component';
import { Inconsistency } from 'src/app/core/inconsistency';

@Injectable({
  providedIn: 'root'
})
export class NotificationPanelService {

  constructor(
    private dialog: MatDialog
  ) { }

  show(
    headerMessage: string = 'Atenção',
    inconsistencies: Inconsistency[] = null!,
    onCloseClick: () => void,
    showHeader: boolean = true,
    closeButtonCaption: string = 'Fechar') {
    this.dialog.open(
      NotificationPanelComponent,
      {
        width: '60%',
        data: {
          showHeader,
          headerMessage,
          inconsistencies,
          onCloseClick,
          closeButtonCaption
        }
      });
  }
}