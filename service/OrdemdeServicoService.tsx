import { Projeto } from "@/types";
import api from "./BaseService";

class OrdemServicoService {

    listar(page = 0, size = 10) {
        return api.get<Projeto.Page<Projeto.OrdemDeServico>>(
            `/ordem-servico?page=${page}&size=${size}`
        );
    }

    criar(payload: {
        ocorrenciaId: number;
        cpfTecnico: string;
        descricaoServico: string;
    }) {
        return api.post<Projeto.OrdemDeServico>(
            `/ordem-servico`,
            payload
        );
    }

    atualizar(
        id: number,
        payload: {
            ocorrenciaId: number;
            cpfTecnico: string;
            descricaoServico: string;
        }
    ) {
        return api.put<Projeto.OrdemDeServico>(
            `/ordem-servico/${id}`,
            payload
        );
    }

    alterarStatus(id: number, statusOS: string) {
        return api.patch<Projeto.OrdemDeServico>(
            `/ordem-servico/${id}/status`,
            { statusOS }
        );
    }

    alterarDataConclusao(id: number, dataConclusaoOS: string) {
        return api.patch<Projeto.OrdemDeServico>(
            `/ordem-servico/${id}/data-conclusao`,
            { dataConclusaoOS }
        );
    }

    excluir(id: number) {
        return api.delete(`/ordem-servico/${id}`);
    }
}

export default new OrdemServicoService();
