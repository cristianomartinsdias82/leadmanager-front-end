import { Component, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'ldm-auth-callback',
  template: `<p>auth-callback works!</p>`,
  styles: []
})
export class AuthCallbackComponent implements OnInit {

  constructor(private oidcSecurityService: OidcSecurityService) {}

  ngOnInit() {

      this.oidcSecurityService
        .checkAuth()
        .subscribe((_) => {});

  }
}
