import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Observable, debounceTime, filter, mergeMap } from "rxjs";
import { Endereco } from "src/app/address-search/models/endereco";
import { AddressSearchService } from "src/app/address-search/services/address-search.service";
import { ApplicationResponse } from "src/app/common/application-response";
import { MessageType } from "src/app/common/ui/widgets/prompt-dialog/message-type";
import { OnLeave } from "src/app/common/ui/navigation/on-leave";
import { NotificationService } from "src/app/common/ui/widgets/notification-dialog/notification.service";
import { PromptService } from "src/app/common/ui/widgets/prompt-dialog/prompt.service";
import { CustomValidators } from "src/app/common/validation/custom-validators";
import { Lead } from "src/app/leads/common/models/lead";
import { LeadsService } from "src/app/leads/common/services/leads.service";

@Component({
  selector: "ldm-maintain-lead",
  templateUrl: "./maintain-lead.component.html",
  styleUrls: ["./maintain-lead.component.scss"],
})
export class MaintainLeadComponent implements OnInit, OnLeave {
  @ViewChild("Numero") numeroFieldRef!: ElementRef;

  maintainLeadForm!: FormGroup;
  get formTitle() {
    return !!!this.leadId ? "Novo lead" : "Lead";
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
    return !this.cnpjField.errors &&
           !this.razaoSocialField.errors &&
           !this.cepField.errors &&
           !this.enderecoField.errors &&
           !this.numeroField.errors &&
           !this.bairroField.errors &&
           !this.cidadeField.errors &&
           !this.estadoField.errors &&
           !this.complementoField.errors;
  }
  
  private get leadId() : string | null
  {
    return location.pathname.split('/')[3] || null;
  }

  private get leadForm(): AbstractControl<any, any> | null {
    return this.maintainLeadForm.get('leadData');
  }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private leadsService: LeadsService,
    private addressSearchService: AddressSearchService,
    private promptService: PromptService,
    private notificationService: NotificationService    
  ) {
    
  }

  ngOnInit() {

    this.maintainLeadForm = this.formBuilder.group({
      leadData: this.formBuilder.group({
        cnpj: [
          "",
          Validators.compose([Validators.required, CustomValidators.cnpj]),
          [CustomValidators.checkExistingLeadValidator(this.leadsService, this.leadId)]
        ],
        razaoSocial: [
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(100),
          ]),
          [CustomValidators.checkExistingLeadValidator(this.leadsService, this.leadId)]
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
      }),
    });

    if (this.leadId) {
      this.loadLeadData();
    }

    this.cepField.valueChanges
      .pipe(
        debounceTime(500),
        filter((input) => CustomValidators.isCepMatch(input)),
        mergeMap((input) => this.addressSearchService.search(input))
      )
      .subscribe((response: ApplicationResponse<Endereco>) => {
        if (!response.data) {
          this.enderecoField.setValue("");
          this.bairroField.setValue("");
          this.cidadeField.setValue("");
          this.estadoField.setValue("");

          if (response.message) {
            this.notificationService.displayMessage(
              response.message ? response.message : "Endereço não localizado.",
              MessageType.Error
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
          let lead = result.data!;
          delete lead.id;

          this.leadForm!.setValue(lead);
          this.leadForm!.markAsTouched();
        });
    }, 0);
  }

  onSubmit() {

    this.promptService.openDialog(
      "Salvar os dados?",
      () => {
        this.maintainLeadForm.markAsPristine();
        this.leadsService
          .save(this.maintainLeadForm.value.leadData as Lead, this.leadId)
          .subscribe((_) => this.router.navigate(["/leads"]));
      },
      () => {},
      "Confirmação"
    );

  }

  onCancelClick() {
    this.router.navigate(["/"]);
  }

  onLeave(): boolean | Observable<boolean> {
    if (this.maintainLeadForm.pristine) return true;

    this.promptService.openDialog(
      "Você tem dados que ainda não foram salvos. Deseja realmente sair desta página? Todos os dados serão perdidos!",
      () => {
        this.maintainLeadForm.markAsPristine();
        this.router.navigate(["leads"]);
      },
      () => {},
      "Sair desta página"
    );

    return false;
  }

  private getField(fieldName: string): AbstractControl<any, any> | null {
    return this.leadForm!.get(fieldName)!;
  }
}

//If time permits
// class LeadFormControlsConfiguration {
//   static Endereco = 'endereco';
//   static RazaoSocial = 'razaosocial';
//   static Numero = 'numero';
//   static Complemento = 'complemento';
//   static Cidade = 'cidade';
//   static Bairro = 'bairro';
//   static Estado = 'estado';
//   static Cnpj = 'cnpj';
//   static Cep = 'cep';

//   static Endereco2: FormControlMetadata = {
//     name: 'endereco',
//     minlength: 5,
//     maxlength: 100,
//     required: true
//   };
// }

// interface FormControlMetadata {
//   name: string,
//   minlength?: number,
//   maxlength?: number,
//   required: boolean
// }