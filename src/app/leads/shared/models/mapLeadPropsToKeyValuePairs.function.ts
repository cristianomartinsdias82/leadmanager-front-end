import { Inconsistency } from "src/app/shared/core/api-response/inconsistency";
import { Lead } from "./lead";

export function mapLeadPropsToKeyValuePairs(leadData: Lead) : Inconsistency[] {

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
