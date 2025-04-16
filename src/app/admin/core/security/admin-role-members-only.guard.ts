import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { firstValueFrom } from 'rxjs';
import { SessionUserData } from 'src/app/core/security/jwt/session-user-data';
import { Roles } from 'src/app/core/security/roles';

export const AdminRoleMembersOnlyGuard: CanMatchFn = async () => {
  const oidcService = inject(OidcSecurityService);
  const router = inject(Router);
  const userData = await firstValueFrom(oidcService.getUserData()) as SessionUserData;

  if (userData === null || (userData.role ?? '') !== Roles.Administrators)
    return router.navigate(['/access-denied']);

  return true;
};
