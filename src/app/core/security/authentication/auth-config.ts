//https://github.com/damienbod/angular-auth-oidc-client

import { LogLevel } from "angular-auth-oidc-client";

export const authConfig: any = {
  authority: 'https://localhost:7266',
  redirectUrl: 'http://localhost:4200/auth-callback',
  postLogoutRedirectUri: 'http://localhost:4200/logout',
  clientId: 'leadmanager_spa',
  scope: 'openid profile roles offline_access',
  responseType: 'code',
  silentRenew: true,
  useRefreshToken: true,
  logLevel: LogLevel.Warn,
  secureRoutes: ['https://localhost:7266/api/']
};