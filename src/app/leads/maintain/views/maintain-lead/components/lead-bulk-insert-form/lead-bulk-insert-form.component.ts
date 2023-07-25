import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PromptService } from 'src/app/common/ui/widgets/prompt-dialog/prompt.service';
import { CustomValidators } from 'src/app/common/validation/custom-validators';
import { LeadsService } from 'src/app/leads/common/services/leads.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: "ldm-lead-bulk-insert-form",
  templateUrl: "./lead-bulk-insert-form.component.html",
  styleUrls: ["./lead-bulk-insert-form.component.scss"]
})
export class LeadBulkInsertFormComponent implements OnInit /*, OnLeave*/ {

  @Output() cancel = new EventEmitter<boolean>();
  @Output() success = new EventEmitter<void>();
  
  readonly maxSize = environment.fileUploadMaxSize;
  readonly bulkFileInputId = "arquivoLote";

  bulkInsertLeadForm!: FormGroup;
  
  constructor(
    private formBuilder: FormBuilder,
    private leadsService: LeadsService,
    private promptService: PromptService
  ) {
    
  }

  ngOnInit() {
    this.configForm();
  }

  configForm() 
  {
    this.bulkInsertLeadForm = this.formBuilder.group({
      [this.bulkFileInputId]: [
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
          .uploadLeadsFile(this.arquivoLoteField.value._files[0] as File)
          .subscribe(_ => this.success.emit());
      },
      () => {},
      "Confirmação"
    );

  }

  onCancelClick() {
    this.cancel.emit(this.bulkInsertLeadForm.pristine);
  }

  getField(fieldName: string): AbstractControl<any, any> {
    return this.bulkInsertLeadForm.get(fieldName)!;
  }

  get arquivoLoteField(): AbstractControl<any, any> {
    return this.getField(this.bulkFileInputId)!;
  }
}