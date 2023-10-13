//https://github.com/manfredsteyer/angular-oauth2-oidc npm package
//Creating a Single-Sign-On Angular Application | OAuth2 and OIDC (https://www.youtube.com/watch?v=AcuzemsJfxA)

import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer: 'https://localhost:7266',

  // Url of the SPA to redirect the user to after login
  redirectUri: 'http://localhost:4200/leads',

  // The SPA's id. The SPA is registered with this id at the auth-server
  clientId: 'leadmanager_spa',

  // Just needed if your auth server demands a secret. In general, this
  // is a sign that the auth server is not configured with SPAs in mind
  // and it might not enforce further best practices vital for security
  // such applications.
  // dummyClientSecret: 'secret',

  responseType: 'code',

  // set the scope for the permissions the client should request
  // Important: Request offline_access to get a refresh token
  // The api scope is a usecase specific one
  scope: 'openid profile roles offline_access',

  showDebugInformation: true,

  clockSkewInSec: 10,

  postLogoutRedirectUri: 'http://localhost:4200'
};