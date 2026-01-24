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

    export type Tecnico = {
        id: number;
        nome: string;
        cpf: string;
        funcao: string;
        email: string;
        telefone: string;
    };

    export type Ocorrencia = {
        id: number;
        descricao: string;
        data: string;
        status: string;
        ativo: Ativo;
    };

    export type OrdemDeServico = {
        id: number;
        descricao: string;
        data: string;
        status: string;
        tecnico: Tecnico;
        ocorrencia: Ocorrencia;
    };

}
