import { AbstractControl, AsyncValidatorFn, FormControl, ValidationErrors } from "@angular/forms";
import { Observable, debounceTime, filter, map, mergeMap, of, tap } from "rxjs";
import { LeadsService } from "src/app/leads/shared/services/leads.service";
import { ApplicationResponse } from "src/app/shared/core/api-response/application-response";

export class CustomValidators {

    private static knownInvalidCnpjs = [
        "00000000000000",
        "11111111111111",
        "22222222222222",
        "33333333333333",
        "44444444444444",
        "55555555555555",
        "66666666666666",
        "77777777777777",
        "88888888888888",
        "99999999999999"
    ];

    static isCnpjMatch(input: string) : boolean {
        return new RegExp(/^[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}\-[0-9]{2}$/g).test(input);
    }

    static cnpj(control: FormControl) : ValidationErrors | null {

        const invalidCnpj = { invalidCnpj : true };

        if (!CustomValidators.isCnpjMatch(control.value))
            return invalidCnpj;

        //https://www.geradorcnpj.com/javascript-validar-cnpj.htm
        const cnpj = control.value.replace(/[^\d]+/g,'');
 
        if (CustomValidators.knownInvalidCnpjs.includes(cnpj))
             return invalidCnpj;
         
        let tamanho = cnpj.length - 2;
        let numeros = cnpj.substring(0,tamanho);
        const digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;

        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            
            if (pos < 2) {
                pos = 9;
            }
        }

        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0))
            return invalidCnpj;
            
        tamanho = tamanho + 1;
        numeros = cnpj.substring(0,tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;

            if (pos < 2) {
                pos = 9;
            }
        }

        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

        if (resultado != digitos.charAt(1)) {
            return invalidCnpj;
        }
            
        return null;
    }

    static isCepMatch(input: string) : boolean {
        return CustomValidators.CepRegex.test(input);
    }

    static cep(control: FormControl) : ValidationErrors | null {
        return !CustomValidators.CepRegex.test(control.value) ? CustomValidators.CepValidationError() : null;
    }

    public static get CepRegex() : RegExp {
        return new RegExp(/^[0-9]{5}\-[0-9]{3}$/g);
    }

    public static CepValidationError() : ValidationErrors {
        return { invalidCep : true };
    }

    public static ExistingLeadValidationError() : ValidationErrors {
        return { existingLead : true };
    }

    //This implementation is not something I'm not proud of
    //but at least it prevents the lead maintenance form from
    //sending multiple unnecessary search requests by CNPJ
    //and Razão Social fields when a lead is loaded
    private static existingLeadValidationCheckLocked = false;
    public static setExistingLeadValidatorLock(lock: boolean) {
        this.existingLeadValidationCheckLocked = lock;
    }

    public static checkExistingLeadValidator(
        leadsService: LeadsService,
        leadId: string | null,
        minLengthToTriggerValidation: number,
        delayInSecs: number = 0): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            
            if (CustomValidators.existingLeadValidationCheckLocked || control.value.trim().length < minLengthToTriggerValidation)
                return of(null);

            return control
                    .valueChanges
                    .pipe(
                        debounceTime(delayInSecs * 1000),
                        filter(input => input.length >= minLengthToTriggerValidation),
                        mergeMap(input => leadsService.exists(input, leadId)),
                        map((result: ApplicationResponse<boolean>) => result.data ? CustomValidators.ExistingLeadValidationError() : null),
                        tap(result => { control.setErrors(result); })
                    );

        };
    }

    // public static checkExistingLeadValidator(leadsService: LeadsService, leadId: string | null, minLengthToTriggerValidation: number = 5): AsyncValidatorFn {
    //     return (control: AbstractControl): Observable<ValidationErrors | null> => {
     
    //         const input = control.value;
    //         if (input < minLengthToTriggerValidation)
    //             return of(null);

    //         return leadsService
    //                 .exists(input, leadId)
    //                 .pipe(
    //                     map((result: ApplicationResponse<boolean>) => result.data ? CustomValidators.ExistingLeadValidationError() : null),
    //                     tap(result => { control.setErrors(result); })
    //                 );

    //     };
    // }

    public static checkInformedFileValidator(fileMaxSize: number, acceptedContentTypes: string[]): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
          
              if (!control.value) {
                return of({ required : true });
              }
          
              if (control.value._files && control.value._files.length > 0) {
                const file = control.value._files[0] as File;

                if (acceptedContentTypes.indexOf(file.type) < 0) {
                  return of({ accept : true });
                }
          
                if (file.size > fileMaxSize) {
                  return of({ size : true });
                }
              }
          
              return of(null);

        };
    }
}