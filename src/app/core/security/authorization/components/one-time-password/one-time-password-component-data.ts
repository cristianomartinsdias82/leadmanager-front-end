import { Observable } from "rxjs";
import { ApplicationResponse } from "src/app/shared/core/api-response/application-response";

export interface OneTimePasswordComponentData {
    digitCount: number,
    requestedPermission: string,
    lifeSpanInSeconds: number,
    onSend: (input: string) => Observable<ApplicationResponse<boolean>>,
    onResendCodeRequested: () => Observable<ApplicationResponse<boolean>>
}