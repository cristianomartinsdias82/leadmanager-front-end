import { HttpEvent, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EMPTY, Observable } from "rxjs";
import { LeadsService } from "src/app/leads/common/services/leads.service";
import { ConflictResolutionData } from "../infrastructure/conflict-resolution-data";
import { NotificationPanelService } from "../ui/widgets/notification-panel/notification-panel.service";
import { RecordStates } from "../infrastructure/record-states";
import { PromptService } from "../ui/notification/prompt.service";
import { Router } from "@angular/router";
import { Inconsistency } from "../infrastructure/inconsistency";
import { Lead } from "src/app/leads/common/models/lead";

@Injectable({ providedIn: 'root' })
export class ConflictResolutionService {
    constructor(
        private router: Router,
        private leadsService: LeadsService,
        private promptService: PromptService,
        private notificationPanelService: NotificationPanelService) {}

    resolve(data: ConflictResolutionData, request: HttpRequest<any>, serverMessage?: string) : Observable<HttpEvent<any>> {

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
                                ConflictResolutionService.toKeyValuePair(data.leadData!),
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

    private static toKeyValuePair(leadData: Lead) : Inconsistency[] {

        return [
            { fieldOrLabel: 'Cnpj', description: leadData.cnpj },
            { fieldOrLabel: 'Razão social', description: leadData.razaoSocial },
            { fieldOrLabel: 'Endereço', description: leadData.endereco },
            { fieldOrLabel: 'Número', description: leadData.numero ? leadData.numero : '' },
            { fieldOrLabel: 'Complemento', description: leadData.complemento ? leadData.complemento : '' },
            { fieldOrLabel: 'Bairro', description: leadData.bairro },
            { fieldOrLabel: 'Cidade', description: leadData.cidade },
            { fieldOrLabel: 'Estado', description: leadData.estado },
            { fieldOrLabel: 'Cep', description: leadData.cep },
        ] as Inconsistency[];
    }
}