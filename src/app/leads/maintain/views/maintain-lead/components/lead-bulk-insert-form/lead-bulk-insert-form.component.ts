import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { OnLeave } from 'src/app/common/ui/navigation/on-leave';
import { PromptService } from 'src/app/common/ui/widgets/prompt-dialog/prompt.service';
import { CustomValidators } from 'src/app/common/validation/custom-validators';
import { LeadsService } from 'src/app/leads/common/services/leads.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: "ldm-lead-bulk-insert-form",
  templateUrl: "./lead-bulk-insert-form.component.html",
  styleUrls: ["./lead-bulk-insert-form.component.scss"],
})
export class LeadBulkInsertFormComponent implements OnInit /*, OnLeave*/ {

  readonly maxSize = environment.fileUploadMaxSize;
  bulkInsertLeadForm!: FormGroup;
  @Output() cancel = new EventEmitter<boolean>();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private leadsService: LeadsService,
    private promptService: PromptService,
    public invalidFileFormatStateMatcher: ErrorStateMatcher
  ) {
    
  }

  ngOnInit() {
    this.configForm();
  }

  configForm() 
  {
    this.bulkInsertLeadForm = this.formBuilder.group({
      arquivoLote: [
        undefined,
        Validators.required,
        CustomValidators.checkInformedFileValidator(this.maxSize, ['.csv','text/csv','application/vnd.ms-excel'])
      ]
    });
  }

  onSubmit() {

    this.promptService.openDialog(
      "Salvar os dados?",
      () => {
        this.bulkInsertLeadForm.markAsPristine();
        this.leadsService
          .bulkInsert(this.bulkInsertLeadForm.value)
          .subscribe(_ => this.router.navigate(["/leads"]));
      },
      () => {},
      "Confirmação"
    );

  }

  onCancelClick() {
    this.cancel.emit(this.bulkInsertLeadForm.pristine);
  }

  // onLeave(): boolean | Observable<boolean> {

  //   if (this.bulkInsertLeadForm.pristine) {
  //     return true;
  //   }

  //   this.promptService.openDialog(
  //     "Você tem dados que ainda não foram salvos. Deseja realmente sair desta página? Todos os dados serão perdidos!",
  //     () => {
  //       this.bulkInsertLeadForm.markAsPristine();
  //       this.router.navigate(["leads"]);
  //     },
  //     () => {},
  //     "Sair desta página"
  //   );

  //   return false;
  // }

  getField(fieldName: string): AbstractControl<any, any> {
    return this.bulkInsertLeadForm.get(fieldName)!;
  }

  get arquivoLoteField(): AbstractControl<any, any> {
    return this.getField('arquivoLote')!;
  }
}