import { ObjectProps } from "../common/object-props";

export interface SerializedLeadData {
    RazaoSocial: string;
    Cnpj: string;
    Cep: string;
    Estado: string;
    Cidade: string;
    Logradouro: string;
    Bairro: string;
    Numero?: string;
    Complemento?: string;
}

export const LeadDataCaptionMap: ObjectProps<string> = {
    'RazaoSocial' : 'Razão social',
    'Cnpj' : 'Cnpj',
    'Cep' : 'Cep',
    'Logradouro' : 'Endereço',
    'Cidade' : 'Cidade',
    'Bairro' : 'Bairro',
    'Estado' : 'Estado',
    'Numero' : 'Número',
    'Complemento' : 'Complemento'
  };