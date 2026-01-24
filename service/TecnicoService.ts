import axios from "axios";
import { Projeto } from "@/types";

const api = axios.create({
    baseURL: "http://localhost:8080/api"
});

export class TecnicoService {

    listar(page = 0, size = 10) {
        return api.get<Projeto.Page<Projeto.Tecnico>>(
            `/tecnicos?page=${page}&size=${size}`
        );
    }

    buscarPorId(id: number) {
        return api.get<Projeto.Tecnico>(`/tecnicos/${id}`);
    }

    criar(tecnico: Projeto.Tecnico) {
        return api.post<Projeto.Tecnico>('/tecnicos', tecnico);
    }

    atualizar(id: number, tecnico: Projeto.Tecnico) {
        return api.put<Projeto.Tecnico>(`/tecnicos/${id}`, tecnico);
    }

    excluir(id: number) {
        return api.delete(`/tecnicos/${id}`);
    }
}
