import { Projeto } from "@/types";
import api from "./BaseService";

class OcorrenciaService {

    listar(page = 0, size = 10) {
        return api.get<Projeto.Page<Projeto.Ocorrencia>>(
            `/ocorrencias?page=${page}&size=${size}`
        );
    }

    criar(payload: {
        ativoId: number;
        descricaoOcorrencia: string;
        prioridadeOcorrencia: string;
    }) {
        return api.post<Projeto.Ocorrencia>(
            `/ocorrencias`,
            payload
        );
    }

    atualizar(
        id: number,
        payload: {
            ativoId: number;
            descricaoOcorrencia: string;
            prioridadeOcorrencia: string;
        }
    ) {
        return api.put<Projeto.Ocorrencia>(
            `/ocorrencias/${id}`,
            payload
        );
    }

    alterarStatus(id: number, statusOcorrencia: string) {
        return api.patch<Projeto.Ocorrencia>(
            `/ocorrencias/${id}/status`,
            { statusOcorrencia }
        );
    }

    alterarPrioridade(id: number, prioridadeOcorrencia: string) {
        return api.patch<Projeto.Ocorrencia>(
            `/ocorrencias/${id}/prioridade`,
            { prioridadeOcorrencia }
        );
    }

    excluir(id: number) {
        return api.delete(`/ocorrencias/${id}`);
    }
}

export default new OcorrenciaService();
