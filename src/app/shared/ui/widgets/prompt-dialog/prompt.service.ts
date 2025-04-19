import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { YesNoPromptComponent } from './yes-no-prompt-dialog/yes-no-prompt.component';
import { PromptActionButton } from './custom-prompt-dialog/prompt-action-button';
import { CustomPromptComponent } from './custom-prompt-dialog/custom-prompt.component';
import { ComponentType } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root'
})
export class PromptService {

  constructor(private dialog: MatDialog) { }

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
    title = 'Atenção',
    description?: string,
    question?: string,
    widthInPercent: number = 50,
    ...actionButtons: PromptActionButton[]
  ) {
    this.dialog.open(
      CustomPromptComponent,
      {
        width: `${widthInPercent}%`,
        data: {
          title,
          description,
          question,
          actionButtons
        }
      });
  }

  //https://stackoverflow.com/questions/57057287/using-generic-type-parameter-in-angular-material-dialog-dialog-open-method
  openDialog<TComponent, TData>(
    component: ComponentType<TComponent>,
    data: TData,
    widthInPercent: number = 50
  ) : MatDialogRef<TComponent> {

    return this.dialog.open(
      component,
      {
        width: `${widthInPercent}%`,
        data
      });
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
