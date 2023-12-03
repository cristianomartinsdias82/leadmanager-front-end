// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { LogLevel } from "angular-auth-oidc-client";

export const environment = {
    production: true,
    apiUrl: 'https://localhost:7244/api',
    apiKeyHeaderName: 'LeadManager-Api-Key',
    apiKeyHeaderValue: '74ynfkjy487yue47j',
    fileUploadMaxSize: 10485760,
    requestTimeoutInSecs: 30,
    authConfig: {
      authority: 'https://localhost:7266',
      redirectUrl: 'http://localhost:4200/auth-callback',
      postLogoutRedirectUri: 'http://localhost:4200/user-logged-out',
      clientId: 'leadmanager_spa',
      scope: 'openid profile roles offline_access',
      responseType: 'code',
      silentRenew: true,
      useRefreshToken: true,
      logLevel: LogLevel.Error,
      secureRoutes: ['https://localhost:7266/api/']
    },
    oneTimePassword: {
      countdownDigitCount: 6,
      expirationTimeInSeconds: 120,
      dialogWidthInPercent: 20,
      otpChallengeStatusCode: 461,
      otpInvalidStatusCode: 462,
      otpExpiredStatusCode: 463
    }
};
  
  /*
   * For easier debugging in development mode, you can import the following file
   * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
   *
   * This import should be commented out in production mode because it will have a negative impact
   * on performance if an error is thrown.
   */
  // import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
  