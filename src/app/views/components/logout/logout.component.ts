import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/core/security/authentication/authentication.service';

@Component({
  selector: 'ldm-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {

  constructor(private authenticationService: AuthenticationService) {}

  onLogoutClick() {
    this.authenticationService.logout();
  }
}