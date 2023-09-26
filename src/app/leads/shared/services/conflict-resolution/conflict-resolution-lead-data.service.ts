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
        serverMessage?: string) : Observable<HttpEvent<any>> {

        if (request.method === 'PUT') {
            if (data.recordState === RecordStates.Modified) {

                this.promptService.openCustomDialog(
                    'Atenção',
                    serverMessage,
                    80,
                    {
                        caption: 'Visualizar os dados',
                        matColor: 'primary',
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
                        caption: 'Recarregar a tela (seus dados serão perdidos)',
                        matColor: 'warn',
                        action: () => {
                            window.location.reload();
                        }
                    },
                    {
                        caption: 'Ir para a tela de listagem',
                        matColor: 'primary',
                        action: () => {
                            this.promptService.closeDialog();
                            this.router.navigate(['/leads']);
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
                    'Atenção',
                    serverMessage,
                    80,
                    {
                        caption: 'Ir para a tela de listagem',
                        matColor: 'primary',
                        action: () => {
                            this.promptService.closeDialog();
                            this.router.navigate(['/leads']);
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
                    'Atenção',
                    serverMessage,
                    80,
                    {
                        caption: 'Ver os detalhes',
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
