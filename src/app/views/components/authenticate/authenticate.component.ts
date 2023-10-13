import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationStickerService } from 'src/app/shared/ui/widgets/notification-sticker/notification-sticker.service';
import { MessageTypes } from 'src/app/shared/ui/notification/message-types';
import { AuthenticationService } from 'src/app/shared/authentication/authentication.service';
import { AuthenticationData } from 'src/app/shared/authentication/authentication-data.model';

@Component({
  selector: "ldm-authenticate",
  templateUrl: "authenticate.component.html",
  styleUrls: ["authenticate.component.scss"],
})
export class AuthenticateComponent implements OnInit, AfterViewInit {

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private notificationStickerService: NotificationStickerService
  ) {}

  @ViewChild('Usuario') usuarioFieldRef!: ElementRef;
  authenticationForm!: FormGroup;

  get usuarioField() {
    return this.getField("usuario")!;
  }

  get senhaField() {
    return this.getField("senha")!;
  }

  get authenticationData(): AuthenticationData {
    return this.authenticationForm.value as AuthenticationData;
  }

  get userIsAuthenticated$() {
    return this.authenticationService.userIsAuthenticated$;
  } 

  ngOnInit() {
    
    this.configForm();
    
    if (this.authenticationService.isAuthenticated())
      this.router.navigate(['/leads']);
  }

  ngAfterViewInit() {
    setTimeout(() => {
    this.usuarioFieldRef.nativeElement.focus();
    }, 0);
  }

  onPastePassword(e:Event) {
    e.preventDefault();
  }

  onSubmit() {
    this.authenticationService
        .authenticate(this.authenticationData)
        .subscribe({
          error: () => this.notificationStickerService.show('Usuário e/ou senha inválidos.', MessageTypes.Error),
          next: () => this.router.navigate(['/leads'])
    });
  }

  configForm() {
    this.authenticationForm = this.formBuilder.group({
        usuario: ["", [Validators.required]],
        senha: ["", [Validators.required]]
      });
  }

  private getField(fieldName: string): AbstractControl<any, any> | null {
    return this.authenticationForm!.get(fieldName)!;
  }
}
