import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../authentication.service';

@Component({
  selector: 'ldm-auth-callback',
  template: '',
  styles: []
})
export class AuthCallbackComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit() {
      this.authenticationService.initializeAuthFlow();
  }
}
