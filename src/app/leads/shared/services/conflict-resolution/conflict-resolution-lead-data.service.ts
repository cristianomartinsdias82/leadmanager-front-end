import { HttpEvent, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { EMPTY, Observable } from "rxjs";
import { LeadsService } from "src/app/leads/shared/services/leads.service";
import { PromptService } from "src/app/shared/ui/widgets/prompt-dialog/prompt.service";
import { NotificationPanelService } from "src/app/shared/ui/widgets/notification-panel/notification-panel.service";
import { ConflictResolutionService } from "src/app/shared/conflict-resolution/conflict-resolution.service";
import { ConflictResolutionLeadData } from "./conflict-resolution-lead-data";
import { Lead } from "../../models/lead";
import { RecordStates } from "./record-states";
import { mapLeadPropsToKeyValuePairs } from "../../models/mapLeadPropsToKeyValuePairs.function";

@Injectable({ providedIn: 'root' })
export class ConflictResolutionLeadDataService extends ConflictResolutionService<Lead> {
    constructor(
        private router: Router,
        private leadsService: LeadsService,
        private promptService: PromptService,
        private notificationPanelService: NotificationPanelService) {
            super();
        }

    resolve(
        data: ConflictResolutionLeadData,
        request: HttpRequest<any>,
        message?: string) : Observable<HttpEvent<any>> {

        const DefaultTitle = 'Atenção';
        const DefaultQuestion = 'Como deseja prosseguir?';
        const DialogWidthInPercentage = 15;

        if (request.method === 'PUT') {
            if (data.recordState === RecordStates.Modified) {

                this.promptService.openCustomDialog(
                    DefaultTitle,
                    message,
                    DefaultQuestion,
                    DialogWidthInPercentage,
                     //The buttons
                    {
                        caption: 'Visualizar as alterações',
                        matColor: 'accent',
                        action: () => {

                            this.notificationPanelService.show(
                                'Dados atualizados',
                                mapLeadPropsToKeyValuePairs(data.leadData!),
                                null!,
                                true,
                                'Fechar');
                        }
                    },
                    {
                        caption: 'Revisar e sobrescrever',
                        matColor: 'accent',
                        action: () => {
                            this.leadsService.setLeadNewRevision(data.revisionUpdate!);
                            this.promptService.closeDialog();
                        }
                    },
                    {
                        caption: 'Recarregar a tela',
                        matColor: 'accent',
                        action: () => {
                            window.location.reload();
                        },
                        tooltip: {
                            text: 'Com esta ação, seus dados serão perdidos'
                        }
                    },
                    {
                        caption: 'Ir para a tela de listagem',
                        matColor: 'accent',
                        action: () => {
                            this.promptService.closeDialog();
                            this.router.navigate(['/leads']);
                        },
                        tooltip: {
                            text: 'Com esta ação, seus dados serão perdidos'
                        }
                    },
                    {
                        caption: 'Fechar',
                        matColor: 'primary',
                        action: () => {
                            this.promptService.closeDialog();
                        }
                    });

            } else if (data.recordState === RecordStates.Deleted) {

                this.promptService.openCustomDialog(
                    DefaultTitle,
                    message,
                    DefaultQuestion,
                    DialogWidthInPercentage,
                    //The buttons
                    {
                        caption: 'Ir para a tela de listagem',
                        matColor: 'primary',
                        action: () => {
                            this.promptService.closeDialog();
                            this.router.navigate(['/leads']);
                        },
                        tooltip: {
                            text: 'Com esta ação, seus dados serão perdidos'
                        }
                    },
                    {
                        caption: 'Fechar',
                        matColor: 'primary',
                        action: () => {
                            this.promptService.closeDialog();
                        }
                    });

            }
          
        } else if (request.method === 'DELETE') {
            if (data.recordState === RecordStates.Modified) {

                this.promptService.openCustomDialog(
                    DefaultTitle,
                    message,
                    DefaultQuestion,
                    DialogWidthInPercentage,
                    //The buttons
                    {
                        caption: 'Visualizar as alterações',
                        matColor: 'accent',
                        action: () => {

                            this.promptService.closeDialog();
                            this.router.navigate(['/leads/editar', data.leadData!.id]);
                        }
                    },
                    {
                        caption: 'Recarregar a tela',
                        matColor: 'accent',
                        action: () => {
                            window.location.reload();
                        },
                        tooltip: {
                            text: 'Com esta ação, seus dados serão perdidos'
                        }
                    },
                    {
                        caption: 'Fechar',
                        matColor: 'accent',
                        action: () => {
                            this.promptService.closeDialog();
                        }
                    });
            }
        }
     
        return EMPTY;
    }
}
