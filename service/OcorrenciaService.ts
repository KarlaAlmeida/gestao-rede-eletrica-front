import axios from "axios";
import { Projeto } from "@/types";

const api = axios.create({
    baseURL: "http://localhost:8080/api"
});

export class OcorrenciaService {

    listar(page = 0, size = 10) {
        return api.get<Projeto.Page<Projeto.Ocorrencia>>(
            `/ocorrencias?page=${page}&size=${size}`
        );
    }

    buscarPorId(id: number) {
        return api.get<Projeto.Ocorrencia>(`/ocorrencias/${id}`);
    }

    criar(ocorrencia: Projeto.Ocorrencia) {
        return api.post<Projeto.Ocorrencia>('/ocorrencias', ocorrencia);
    }

    atualizar(id: number, ocorrencia: Projeto.Ocorrencia) {
        return api.put<Projeto.Ocorrencia>(`/ocorrencias/${id}`, ocorrencia);
    }

    excluir(id: number) {
        return api.delete(`/ocorrencias/${id}`);
    }
}
