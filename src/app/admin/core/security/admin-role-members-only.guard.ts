import { AuthenticationService } from './../../../core/security/authentication/authentication.service';
import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { Roles } from 'src/app/core/security/roles';

export const AdminRoleMembersOnlyGuard: CanMatchFn = async () => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  if (!await authService.checkUserMembership(Roles.Administrators))
    return router.navigate(['/access-denied']);

  return true;
};
