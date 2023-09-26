import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { YesNoPromptComponent } from './yes-no-prompt-dialog/yes-no-prompt.component';
import { PromptActionButton } from './custom-prompt-dialog/prompt-action-button';
import { CustomPromptComponent } from './custom-prompt-dialog/custom-prompt.component';

@Injectable({
  providedIn: 'root'
})
export class PromptService {

  constructor(
    private dialog: MatDialog
  ) { }

  openYesNoDialog(
    question: string,    
    onYesClick: () => void,
    onNoClick: () => void,
    title: string = 'Confirmação de operação',
    widthInPercent: number = 50,
    yesCaption: string = 'Sim',
    noCaption: string = 'Não') {
    this.dialog.open(
      YesNoPromptComponent,
      {
        width: `${widthInPercent}%`,
        data: {
          question,
          title,
          yesCaption,
          noCaption,
          onYesClick,
          onNoClick,
        }
      });
  }

  openCustomDialog(
    headerMessage = 'Atenção',
    description?: string,
    widthInPercent: number = 50,
    ...actionButtons: PromptActionButton[]
  ) {
    this.dialog.open(
      CustomPromptComponent,
      {
        width: `${widthInPercent}%`,
        data: {
          headerMessage,
          description,
          actionButtons
        }
      });
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
