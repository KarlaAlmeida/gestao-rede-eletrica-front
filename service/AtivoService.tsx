
import { Projeto } from "@/types";
import api from "./BaseService";

export class AtivoService {

    listar(page = 0, size = 10) {
        return api.get<Projeto.Page<Projeto.Ativo>>(
            `/ativos?page=${page}&size=${size}`
        );
    }

    buscarPorId(id: number) {
        return api.get<Projeto.Ativo>(`/ativos/${id}`);
    }

    criar(ativo: Projeto.AtivoPayload) {
        return api.post<Projeto.Ativo>('/ativos', ativo);
    }

    atualizar(id: number, ativo: Projeto.AtivoPayload) {
        return api.put<Projeto.Ativo>(`/ativos/${id}`, ativo);
    }

    excluir(id: number) {
        return api.delete(`/ativos/${id}`);
    }
}
