import { InboxService } from './../../../../views/components/inbox/services/inbox.service';
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

  constructor(
    private authenticationService: AuthenticationService,
    private inboxService: InboxService
  ) {}

  userEmail = '';
  userIsInAdminRole = false;

   ngOnInit() {

    Promise.all([
      this.authenticationService.getUserData(),
      this.authenticationService.checkUserMembership(Roles.Administrators)
    ]).then(results => {
      this.userEmail = results[0]?.email ?? '';
      this.userIsInAdminRole = results[1];
    });

    this.userIsAuthenticated$.subscribe((authResult) => {
      if (authResult.isAuthenticated) {
        this.inboxService.loadInboxMessages();
      }
    })
  }

  get userIsAuthenticated$() {
    return this.authenticationService.userIsAuthenticated$;
  }

  get userIsOnline$() {
    return this.authenticationService.userIsOnline$;
  }

  get renderAdminLink$() {
    return this.authenticationService.userIsInAdminRole$;
  }

  get userEmail$() {
    return this.authenticationService
                .sessionUserData$
                .pipe(
                  map(userData => !userData || !userData!.email ? null : userData.email)
                );
  }
  get userInboxMessagesCount$() {
    return this.inboxService
                .reportGenerationMessages$
                .pipe(
                  map(messages => messages.length)
                );
  }
}
