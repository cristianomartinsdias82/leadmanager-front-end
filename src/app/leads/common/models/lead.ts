import { Entity } from "./entity";

export interface Lead extends Entity {
    razaoSocial: string;
    cnpj: string;
    cep: string;
    estado: string;
    cidade: string;
    endereco: string;
    bairro: string;
    numero?: string;
    complemento?: string;
}