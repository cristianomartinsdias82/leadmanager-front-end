//Here are great instructions about how to customize an environment (a containerized)

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
    }
};