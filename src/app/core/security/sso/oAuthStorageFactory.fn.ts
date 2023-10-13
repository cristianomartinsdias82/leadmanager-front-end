import { OAuthStorage } from "angular-oauth2-oidc";

export function oAuthStorageFactory(): OAuthStorage {
    return localStorage;
}