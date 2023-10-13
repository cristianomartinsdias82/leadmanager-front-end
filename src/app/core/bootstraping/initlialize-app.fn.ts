import { inject } from "@angular/core";
import { OAuthService } from "angular-oauth2-oidc";
import { authConfig } from "../security/sso/auth-config";


export function initializeApp(): () => Promise<void> {
    return () => {
      const oAuthService = inject(OAuthService);
      oAuthService.initCodeFlow();
      oAuthService.configure(authConfig);
      oAuthService.loadDiscoveryDocumentAndLogin();

      console.log('initializing...');
      // Perform your configuration bootstrapping logic here
      return Promise.resolve(); // Replace with your initialization logic
    };
  }