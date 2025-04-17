import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { AuthenticationService } from 'src/app/core/security/authentication/authentication.service';
import { Roles } from 'src/app/core/security/roles';

@Component({
  selector: 'ldm-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit {

  constructor(private authService: AuthenticationService) {}

  userEmail = '';
  userIsInAdminRole = false;

   ngOnInit() {

    Promise.all([
      this.authService.getUserData(),
      this.authService.checkUserMembership(Roles.Administrators)
    ]).then(results => {
      this.userEmail = results[0]?.email ?? '';
      this.userIsInAdminRole = results[1];
    });
    
  }

  get renderAdminLink$() {
    return this.authService.userIsInAdminRole$;
  }

  get userEmail$() {
    return this.authService
                .sessionUserData$
                .pipe(
                  map(userData => !userData || !userData!.email ? null : userData.email)
                );
  }
}
