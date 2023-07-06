import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PromptComponent } from './prompt.component';

@Injectable({
  providedIn: 'root'
})
export class PromptService {

  constructor(
    private dialog: MatDialog
  ) { }

  openDialog(
    question: string,    
    onYesClick: () => void,
    onNoClick: () => void,
    title: string = 'Confirmação de operação',
    yesCaption: string = 'Sim',
    noCaption: string = 'Não') {
    this.dialog.open(
      PromptComponent,
      {
        width: '500px',
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
}
