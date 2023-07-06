import { Directive, ElementRef, HostBinding, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';
import { CustomValidators } from '../../validation/custom-validators';

//https://stackblitz.com/edit/angular-phone-mask-directive?file=app%2Fapp.component.html
//https://stackblitz.com/edit/cpf-cnpj-directive-service-e-mask?file=src%2Fapp%2Fservices%2Fcpf-cnpj.service.ts

@Directive({
  selector: "[cepMask]",
})
export class CepMaskDirective {
  
  @HostBinding('class.is-invalid') cepInvalid?:boolean;
  @HostBinding('class.is-valid') cepValid?:boolean;
 
  constructor(private el: ElementRef,
              private control: NgControl) {}

  @HostListener('input', ['$event']) onEvent(event:any) {
    let value: any = this.createMask(this.el.nativeElement.value);
    this.control.control!.setValue(value);
      
    this.validate(value);
  }

  @HostListener('keydown', ['$event']) onKeyDown(e: any) {
    if (e.keyCode == 9 || (e.shiftKey && e.keyCode == 9)) {
      let value: any = this.createMask(this.el.nativeElement.value);

      this.control.control!.setValue(value);
      
      this.validate(value);
    }
  }

  private createMask(input: string): string {

    if (input) {
      input = input.toString();
      input = input.replace(/\D/g, '');
      if (input.length >= 6 && input.length <= 9) {
        input = input.replace(/(\d{5})(\d+)/, "$1-$2");
      }
    }

    return input;
  }

  private validate(input: string) {
    this.cepValid = CustomValidators.isCepMatch(input);
    this.cepInvalid = !this.cepValid;
  }
}