import { Observable } from "rxjs";
import { ApplicationResponse } from "src/app/shared/core/api-response/application-response";
import { Timer } from "./timer.model";

export interface OneTimePasswordComponentData {
    countdownDigitCount: number,
    expirationTimeInSeconds: number,
    remainingTime?: Timer,
    onSend: (input: string) => Observable<ApplicationResponse<boolean>>,
    onResendCodeRequested: () => Observable<ApplicationResponse<boolean>>
}