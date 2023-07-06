import { Directive, ElementRef, HostBinding, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';
import { CustomValidators } from '../../validation/custom-validators';

//https://stackblitz.com/edit/angular-phone-mask-directive?file=app%2Fapp.component.html
//https://stackblitz.com/edit/cpf-cnpj-directive-service-e-mask?file=src%2Fapp%2Fservices%2Fcpf-cnpj.service.ts

@Directive({
  selector: "[cnpjMask]",
})
export class CnpjMaskDirective {
  
  @HostBinding('class.is-invalid') cnpjInvalid?:boolean;
  @HostBinding('class.is-valid') cnpjValid?:boolean;
 
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
      switch (input.length) {
          case 4:
              input = input.replace(/(\d+)(\d{3})/, "$1.$2");
              break;
          case 5:
              input = input.replace(/(\d+)(\d{3})/, "$1.$2");
              break;
          case 6:
              input = input.replace(/(\d+)(\d{3})/, "$1.$2");
              break;
          case 7:
              input = input.replace(/(\d+)(\d{3})(\d{3})/, "$1.$2.$3");
              break;
          case 8:
              input = input.replace(/(\d+)(\d{3})(\d{3})/, "$1.$2.$3");
              break;
          case 9:
              input = input.replace(/(\d+)(\d{3})(\d{3})/, "$1.$2.$3");
              break;
          case 10:
              input = input.replace(/(\d+)(\d{3})(\d{3})(\d{1})/, "$1.$2.$3-$4");
              break;
          case 11:
              input = input.replace(/(\d+)(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
              break;
          case 12:
              input = input.replace(/(\d+)(\d{3})(\d{3})(\d{4})/, "$1.$2.$3/$4");
              break;
          case 13:
              input = input.replace(/(\d+)(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
              break;
          case 14:
              input = input.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d+)/, "$1.$2.$3/$4-$5");
              break;
      }
    }

    return input;
  }

  private validate(input: string) {
    this.cnpjValid = CustomValidators.isCnpjMatch(input);
    this.cnpjInvalid = !this.cnpjValid;
  }
}