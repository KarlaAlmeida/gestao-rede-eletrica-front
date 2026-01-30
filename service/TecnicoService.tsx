import { Projeto } from "@/types";
import api from "./BaseService";

export class TecnicoService {

    listar(page = 0, size = 10) {
        return api.get<Projeto.Page<Projeto.Tecnico>>(
            `/tecnicos?page=${page}&size=${size}`
        );
    }

    buscarPorId(id: number) {
        return api.get<Projeto.Tecnico>(`/tecnicos/${id}`);
    }

    criar(payload: Projeto.TecnicoPayload) {
        return api.post<Projeto.Tecnico>('/tecnicos', payload);
    }

    atualizar(id: number, payload: Projeto.TecnicoPayload) {
        return api.put<Projeto.Tecnico>(`/tecnicos/${id}`, payload);
    }

    inativar(id: number) {
        return api.patch<Projeto.Tecnico>(`/tecnicos/${id}/inativar`);
    }

    alterarStatus(id: number, ativo: boolean) {
        return api.patch(`/tecnicos/${id}/status`, { ativo });
    }

    alterarDisponibilidade(id: number, disponivel: boolean) {
        return api.patch<Projeto.Tecnico>(
            `/tecnicos/${id}/disponibilidade`,
            { disponivel }
        );
    }


    excluir(id: number) {
        return api.delete(`/tecnicos/${id}`);
    }
}
