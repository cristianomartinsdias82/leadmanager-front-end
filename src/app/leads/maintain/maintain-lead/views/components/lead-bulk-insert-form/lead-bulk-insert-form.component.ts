import { HttpEventType } from "@angular/common/http";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { filter } from "rxjs";
import { LeadsService } from "src/app/leads/shared/services/leads.service";
import { PromptService } from "src/app/shared/ui/notification/prompt.service";
import { CustomValidators } from "src/app/shared/validation/custom-validators";
import { environment } from "src/environments/environment";

@Component({
  selector: "ldm-lead-bulk-insert-form",
  templateUrl: "./lead-bulk-insert-form.component.html",
  styleUrls: ["./lead-bulk-insert-form.component.scss"],
})
export class LeadBulkInsertFormComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private leadsService: LeadsService,
    private promptService: PromptService
  ) {}

  @Output() cancel = new EventEmitter<boolean>();
  @Output() success = new EventEmitter<void>();

  readonly maxSize = environment.fileUploadMaxSize;
  readonly bulkFileInputId = "arquivoLote";

  bulkInsertLeadForm!: FormGroup;

  ngOnInit() {
    this.configForm();
  }

  configForm() {
    this.bulkInsertLeadForm = this.formBuilder.group({
      [this.bulkFileInputId]: [
        undefined,
        Validators.required,
        CustomValidators.checkInformedFileValidator(this.maxSize, [".csv", "text/csv", "application/vnd.ms-excel"])
      ]
    });
  }

  onSubmit() {
    this.promptService.openYesNoDialog(
      "Salvar os dados?",
      () => {
        this.bulkInsertLeadForm.markAsPristine();
        this.leadsService
          .uploadLeadsFile(this.arquivoLoteField.value._files[0] as File)
          .pipe(filter((data) => data.type === HttpEventType.ResponseHeader))
          .subscribe({
            next: (data: any) => {
              if (data.ok) {
                this.success.emit();
              }
            },
          });
      },
      null!,
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
