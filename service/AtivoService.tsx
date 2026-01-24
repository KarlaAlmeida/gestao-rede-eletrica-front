/*import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:8081"
})

export class AtivoService{

    listarTodos(){
        return axiosInstance.get("api/ativos")
    }

}*/
import axios from "axios";
import { Projeto } from "@/types";

const api = axios.create({
    baseURL: "http://localhost:8081/api"
});

export class AtivoService {

    listar(page = 0, size = 10) {
        return api.get<Projeto.Page<Projeto.Ativo>>(
            `/ativos?page=${page}&size=${size}`
        );
    }

    buscarPorId(id: number) {
        return api.get<Projeto.Ativo>(`/ativos/${id}`);
    }

    criar(ativo: Projeto.Ativo) {
        return api.post<Projeto.Ativo>('/ativos', ativo);
    }

    atualizar(id: number, ativo: Projeto.Ativo) {
        return api.put<Projeto.Ativo>(`/ativos/${id}`, ativo);
    }

    excluir(id: number) {
        return api.delete(`/ativos/${id}`);
    }
}
