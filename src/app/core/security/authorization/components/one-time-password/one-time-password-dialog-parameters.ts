//import { Observable } from "rxjs";

export interface OneTimePasswordDialogParameters {
    resource: string;
    onSendCodeRequest: () => void;
    //onSendCodeRequest: () => Observable<boolean>;
}