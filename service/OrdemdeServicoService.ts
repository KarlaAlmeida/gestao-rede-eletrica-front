import axios from "axios";
import { Projeto } from "@/types";

const api = axios.create({
    baseURL: "http://localhost:8080/api"
});

export class OrdemdeServicoService {

    listar(page = 0, size = 10) {
        return api.get<Projeto.Page<Projeto.OrdemDeServico>>(
            `/ordens-servico?page=${page}&size=${size}`
        );
    }

    buscarPorId(id: number) {
        return api.get<Projeto.OrdemDeServico>(`/ordens-servico/${id}`);
    }

    criar(ordem: Projeto.OrdemDeServico) {
        return api.post<Projeto.OrdemDeServico>('/ordens-servico', ordem);
    }

    atualizar(id: number, ordem: Projeto.OrdemDeServico) {
        return api.put<Projeto.OrdemDeServico>(`/ordens-servico/${id}`, ordem);
    }

    excluir(id: number) {
        return api.delete(`/ordens-servico/${id}`);
    }
}
