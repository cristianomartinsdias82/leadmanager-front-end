import { AbstractControl, AsyncValidatorFn, FormControl, ValidationErrors } from "@angular/forms";
import { Observable, debounceTime, filter, map, mergeMap, tap } from "rxjs";
import { LeadsService } from "src/app/leads/common/services/leads.service";
import { ApplicationResponse } from "../application-response";

export class CustomValidators {

    static isCnpjMatch(input: string) : boolean {
        return new RegExp(/^[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}\-[0-9]{2}$/g).test(input);
    }

    static cnpj(control: FormControl) : ValidationErrors | null {

        const invalidCnpj = { invalidCnpj : true };

        if (!CustomValidators.isCnpjMatch(control.value))
            return invalidCnpj;

        //https://www.geradorcnpj.com/javascript-validar-cnpj.htm
        var cnpj = control.value.replace(/[^\d]+/g,'');
 
        // Elimina CNPJs invalidos conhecidos
        if (cnpj == "00000000000000" || 
            cnpj == "11111111111111" || 
            cnpj == "22222222222222" || 
            cnpj == "33333333333333" || 
            cnpj == "44444444444444" || 
            cnpj == "55555555555555" || 
            cnpj == "66666666666666" || 
            cnpj == "77777777777777" || 
            cnpj == "88888888888888" || 
            cnpj == "99999999999999")
            return invalidCnpj;
         
        // Valida DVs
        let tamanho = cnpj.length - 2
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

    public static checkExistingLeadValidator(leadsService: LeadsService, leadId: string | null): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            
            return control.valueChanges
                    .pipe(
                        debounceTime(750),
                        filter(input => input.length >= 5),
                        mergeMap(input => leadsService.search(input, leadId)),
                        map((result: ApplicationResponse<boolean>) => result.data ? CustomValidators.ExistingLeadValidationError() : null),
                        tap(result => { control.setErrors(result); })
                    );

        };
    }
}