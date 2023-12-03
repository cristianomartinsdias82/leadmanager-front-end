//Here are great instructions about how to customize an environment (a containerized one)

import { LogLevel } from "angular-auth-oidc-client";

//https://medium.com/@hongtatyew/about-environment-ts-in-your-angular-applications-50646ab08c81#:~:text=An%20unhandled%20exception%20occurred%3A%20Configuration,json%20.
export const environment = {
    production: true,
    apiUrl: 'http://localhost:8001/api',
    apiKeyHeaderName: 'LeadManager-Api-Key',
    apiKeyHeaderValue: '74ynfkjy487yue47j',
    fileUploadMaxSize: 10485760,
    requestTimeoutInSecs: 30,
    authConfig: {
      authority: 'https://localhost:8003',
      redirectUrl: 'http://localhost:8002/auth-callback',
      postLogoutRedirectUri: 'http://localhost:8002/user-logged-out',
      clientId: 'leadmanager_spa',
      scope: 'openid profile roles offline_access',
      responseType: 'code',
      silentRenew: true,
      useRefreshToken: true,
      logLevel: LogLevel.Error,
      secureRoutes: ['https://localhost:8001/api/']
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