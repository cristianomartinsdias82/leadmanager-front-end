import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { debounceTime, filter, mergeMap } from "rxjs";
import { Endereco } from "src/app/leads/shared/models/endereco";
import { Lead } from "src/app/leads/shared/models/lead";
import { AddressSearchService } from "src/app/leads/shared/services/address-search.service";
import { RevisionUpdate } from "src/app/leads/shared/services/conflict-resolution/revision-update";
import { LeadsService } from "src/app/leads/shared/services/leads.service";
import { CustomValidators } from "src/app/leads/shared/validation/custom-validators";
import { ApplicationResponse } from "src/app/shared/core/api-response/application-response";
import { MaintenanceModes } from "src/app/shared/core/maintenance-modes";
import { MessageTypes } from "src/app/shared/ui/notification/message-types";
import { NotificationStickerService } from "src/app/shared/ui/widgets/notification-sticker/notification-sticker.service";
import { PromptService } from "src/app/shared/ui/widgets/prompt-dialog/prompt.service";

@Component({
  selector: "ldm-lead-form",
  templateUrl: "./lead-form.component.html",
  styleUrls: ["./lead-form.component.scss"],
})
export class LeadFormComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private leadsService: LeadsService,
    private addressSearchService: AddressSearchService,
    private promptService: PromptService,
    private notificationStickerService: NotificationStickerService,
    private activatedRoute: ActivatedRoute
  ) {}

  @ViewChild("Numero") numeroFieldRef!: ElementRef;
  @Output() cancel = new EventEmitter<boolean>();
  @Output() success = new EventEmitter<void>();
  @Output() leadSelected = new EventEmitter<void>();

  maintenanceMode = MaintenanceModes.NewData;

  skipSearchAutoTrigger = false;

  maintainLeadForm!: FormGroup;

  get formTitle() {
    return !!!this.leadId ? "Novo lead" : "Lead";
  }

  get cnpjFieldEnabled() {
    return this.maintenanceMode === MaintenanceModes.NewData;
  }

  private getField(fieldName: string): AbstractControl<any, any> | null {
    return this.leadForm!.get(fieldName)!;
  }

  get cnpjField() {
    return this.getField("cnpj")!;
  }
  get razaoSocialField() {
    return this.getField("razaoSocial")!;
  }
  get cepField() {
    return this.getField("cep")!;
  }
  get enderecoField() {
    return this.getField("endereco")!;
  }
  get numeroField() {
    return this.getField("numero")!;
  }
  get complementoField() {
    return this.getField("complemento")!;
  }
  get bairroField() {
    return this.getField("bairro")!;
  }
  get cidadeField() {
    return this.getField("cidade")!;
  }
  get estadoField() {
    return this.getField("estado")!;
  }
  get formIsValid() {
    return (
      !this.cnpjField.errors &&
      !this.razaoSocialField.errors &&
      !this.cepField.errors &&
      !this.enderecoField.errors &&
      !this.numeroField.errors &&
      !this.bairroField.errors &&
      !this.cidadeField.errors &&
      !this.estadoField.errors &&
      !this.complementoField.errors
    );
  }

  private get leadId(): string | null {
    return this.activatedRoute.snapshot.params['id'];
  }

  private get leadForm(): AbstractControl<any, any> | null {
    return this.maintainLeadForm.get("leadData");
  }

  ngOnInit() {

    this.configForm();

    if (this.leadId) {
      CustomValidators.setExistingLeadValidatorLock(true);
      this.skipSearchAutoTrigger = true;
      this.loadLeadData();
    }

    this.leadsService.onLeadRevisionUpdate$.subscribe(
      this.onLeadRevisionUpdate.bind(this)
    );
  }

  configForm() {

    this.maintainLeadForm = this.formBuilder.group({
      leadData: this.formBuilder.group({
        cnpj: [
          "",
          Validators.compose([Validators.required, CustomValidators.cnpj]),
          [
            CustomValidators.checkExistingLeadValidator(
              this.leadsService,
              this.leadId,
              18
            ),
          ],
        ],
        razaoSocial: [
          "",
          Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
          [
            CustomValidators.checkExistingLeadValidator(
              this.leadsService,
              this.leadId,
              5,
              1.5
            ),
          ],
        ],
        cep: [
          "",
          Validators.compose([Validators.required, CustomValidators.cep]),
        ],
        endereco: [
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(100),
          ]),
        ],
        numero: ["", Validators.maxLength(20)],
        complemento: ["", Validators.maxLength(50)],
        bairro: [
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
          ]),
        ],
        cidade: [
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
          ]),
        ],
        estado: [
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(30),
          ]),
        ],
        revision: [], //Concurrency checking purposes
      }),
    });

    this.cepField.valueChanges
      .pipe(
        filter((input) => !this.skipSearchAutoTrigger && CustomValidators.isCepMatch(input)),
        debounceTime(0), //Prevents the form from sending two requests
        mergeMap((input) => this.addressSearchService.search(input)),
      )
      .subscribe((response: ApplicationResponse<Endereco>) => {
        if (!response.data) {
          this.enderecoField.setValue("");
          this.bairroField.setValue("");
          this.cidadeField.setValue("");
          this.estadoField.setValue("");

          if (response.message) {
            this.notificationStickerService.show(
              response.message ? response.message : "Endereço não localizado.",
              MessageTypes.Error
            );

            this.cepField.setErrors(CustomValidators.CepValidationError());
          }

          return;
        }

        const data = response.data!;

        this.enderecoField.setValue(data.endereco);
        this.bairroField.setValue(data.bairro);
        this.cidadeField.setValue(data.cidade);
        this.estadoField.setValue(data.estado);

        this.numeroFieldRef.nativeElement.focus();
      });
  }

  loadLeadData() {
    setTimeout(() => {
      this.leadsService
        .getById(this.leadId!)
        .subscribe((result: ApplicationResponse<Lead>) => {
          this.maintenanceMode = MaintenanceModes.DataUpdate;
          let lead = result.data!;
          delete lead.id;

          this.leadForm!.setValue(lead);
          this.leadForm!.markAsTouched();
          this.leadSelected.emit();
          this.skipSearchAutoTrigger = false;
          CustomValidators.setExistingLeadValidatorLock(false);
        });
    }, 0);
  }

  onSubmit() {
    this.promptService.openYesNoDialog(
      "Salvar os dados?",
      () => {
        this.maintainLeadForm.markAsPristine();
        this.leadsService
          .save(this.maintainLeadForm.value.leadData as Lead, this.leadId)
          .subscribe((_) => this.success.emit());
      },
      () => {},
      "Confirmação"
    );
  }

  onCancelClick() {
    this.cancel.emit(this.maintainLeadForm.pristine);
  }

  onLeadRevisionUpdate(revisionUpdate: RevisionUpdate) {
    this.getField("revision")?.setValue(revisionUpdate.revision);
  }
}