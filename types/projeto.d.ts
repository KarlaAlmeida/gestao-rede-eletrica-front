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
        email: string;
        telefone: string;
        ultimoSalario: number;
        ativo: boolean;
        especialidade: string;
        disponivel: boolean;
        endereco: Endereco;
    };

    export type TecnicoPayload = {
        nome: string;
        cpf: string;
        email: string;
        telefone: string;
        ultimoSalario: number;
        ativo: boolean;
        especialidade: string;
        disponivel: boolean;
        cep: string;
        numero?: number;
        complementoNumero?: string;
    };

    export type Ocorrencia = {
        id: number;
        descricaoOcorrencia: string;
        dataRegistroOcorrencia: string;
        prioridadeOcorrencia: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
        statusOcorrencia: 'REGISTRADA' | 'ENCAMINHADA' | 'CONCLUIDA';
        ativo: Ativo;
    };

    export type OrdemDeServico = {
        id: number;
        tecnico: Tecnico;
        ocorrencia: Ocorrencia;
        descricaoServico: string;
        dataCriacaoOS: string;
        dataConclusaoOS?: string;
        statusOS: 'ABERTA' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA';
    };



}