declare namespace Projeto {

    export type Endereco = {
        id?: number;
        cep?: string;
        logradouro?: string;
        numero?: string;
        bairro?: string;
        cidade?: string;
        estado?: string;
    };

    export type Ativo = {
        id: number;
        tipoAtivo: string;
        statusAtivo: string;
        dataInstalacao: string;
        endereco: Endereco;
    };

    export type Page<T> = {
        content: T[];
        totalElements: number;
        totalPages: number;
        size: number;
        number: number;
    };

}
