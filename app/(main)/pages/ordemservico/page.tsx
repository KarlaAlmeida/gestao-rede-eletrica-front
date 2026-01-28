'use client';

import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';

import { Projeto } from '@/types';
import ordemServicoService from '@/service/OrdemdeServicoService';

const OrdemServicoPage = () => {

    const ordemServicoVazia = {
        ocorrenciaId: 0,
        cpfTecnico: '',
        descricaoServico: ''
    };

    const [ordensServico, setOrdensServico] = useState<Projeto.OrdemDeServico[]>([]);
    const [ordemServicoDialog, setOrdemServicoDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [ordemServico, setOrdemServico] = useState<any>(ordemServicoVazia);
    const [ordemServicoId, setOrdemServicoId] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');

    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    const statusOptions = [
        { label: 'Aberta', value: 'ABERTA' },
        { label: 'Em andamento', value: 'EM_ANDAMENTO' },
        { label: 'Concluída', value: 'CONCLUIDA' },
        { label: 'Cancelada', value: 'CANCELADA' }
    ];


    const carregarOrdensServico = () => {
        setLoading(true);
        ordemServicoService.listar(page, rows)
            .then(res => {
                setOrdensServico(res.data.content);
                setTotalRecords(res.data.totalElements);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        carregarOrdensServico();
    }, [page, rows]);

    const openNew = () => {
        setOrdemServico(ordemServicoVazia);
        setOrdemServicoId(null);
        setSubmitted(false);
        setOrdemServicoDialog(true);
    };

    const hideDialog = () => {
        setOrdemServicoDialog(false);
        setSubmitted(false);
    };

    const saveOrdemServico = async () => {
        setSubmitted(true);

        if (
            !ordemServico.descricaoServico ||
            !ordemServico.ocorrenciaId ||
            !ordemServico.cpfTecnico
        ) return;

        const payload = {
            ocorrenciaId: ordemServico.ocorrenciaId,
            cpfTecnico: ordemServico.cpfTecnico,
            descricaoServico: ordemServico.descricaoServico
        };

        console.log("Payload enviado:", payload); // DEBUG

        try {
            if (ordemServicoId) {
                await ordemServicoService.atualizar(ordemServicoId, payload);
            } else {
                await ordemServicoService.criar(payload);
            }

            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Ordem de Serviço salva com sucesso'
            });

            setOrdemServicoDialog(false);
            carregarOrdensServico();

        } catch (err) {
            console.error(err);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao salvar ordem de serviço'
            });
        }
    };


    const editOrdemServico = (row: Projeto.OrdemDeServico) => {
        setOrdemServicoId(row.id);
        setOrdemServico({
            ocorrenciaId: row.ocorrencia.id,
            cpfTecnico: row.tecnico.cpf,
            descricaoServico: row.descricaoServico
        });
        setOrdemServicoDialog(true);
    };

    const confirmDelete = (row: Projeto.OrdemDeServico) => {
        setOrdemServicoId(row.id);
        setDeleteDialog(true);
    };

    const deleteOrdemServico = async () => {
        if (!ordemServicoId) return;

        try {
            await ordemServicoService.excluir(ordemServicoId);
            toast.current?.show({
                severity: 'success',
                summary: 'Excluída',
                detail: 'Ordem de serviço removida'
            });
            setDeleteDialog(false);
            carregarOrdensServico();
        } catch {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao excluir ordem de serviço'
            });
        }
    };

    const header = (
        <div className="flex justify-content-between align-items-center">
            <h5 className="m-0">Gestão de Ordem de Serviços</h5>
            
        </div>
    );

    const actionTemplate = (row: Projeto.OrdemDeServico) => (
        <>
            <Button
                icon="pi pi-pencil"
                rounded
                className="mr-2"
                onClick={() => editOrdemServico(row)}
            />
            <Button
                icon="pi pi-trash"
                rounded
                severity="danger"
                onClick={() => confirmDelete(row)}
            />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">

                    <Toast ref={toast} />

                    <Toolbar
                        className="mb-4"
                        left={() => (
                            <Button label="Nova Ordem de Serviço" icon="pi pi-plus" onClick={openNew} />
                        )}
                    />

                    <DataTable
                        ref={dt}
                        value={ordensServico}
                        lazy
                        paginator
                        first={page * rows}
                        rows={rows}
                        totalRecords={totalRecords}
                        loading={loading}
                        onPage={(e) => {
                            setPage(e.page ?? 0);
                            setRows(e.rows ?? 10);
                        }}
                        dataKey="id"
                        header={header}
                        globalFilter={globalFilter}
                        emptyMessage="Nenhuma ordem de serviço encontrada"
                    >

                        <Column field="id" header="ID" sortable />
                        <Column field="descricaoServico" header="Descrição" sortable />
                        <Column field="ocorrencia.descricaoOcorrencia" header="Ocorrência" />
                        <Column field="tecnico.nome" header="Técnico" />
                        <Column field="dataCriacaoOS" header="Data de criação OS" />


                        <Column
                            header="Data Conclusão"
                            body={(row: Projeto.OrdemDeServico) => (
                                <Calendar
                                    value={row.dataConclusaoOS ? new Date(row.dataConclusaoOS) : null}
                                    dateFormat="dd/mm/yy"
                                    showIcon
                                    onChange={async (e) => {
                                        if (!e.value) return;

                                        const dataISO = e.value.toISOString().substring(0, 10);

                                        try {
                                            await ordemServicoService.alterarDataConclusao(
                                                row.id,
                                                dataISO
                                            );

                                            toast.current?.show({
                                                severity: 'success',
                                                summary: 'Sucesso',
                                                detail: 'Data de conclusão atualizada'
                                            });

                                            carregarOrdensServico();
                                        } catch (error: any) {
                                            console.error(error.response?.data);

                                            toast.current?.show({
                                                severity: 'error',
                                                summary: 'Erro',
                                                detail:
                                                    error.response?.data?.message ??
                                                    'Erro ao atualizar data de conclusão'
                                            });
                                        }
                                    }}
                                />
                            )}
                        />

                        <Column
                            header="Status"
                            body={(row) => (
                                <Dropdown
                                    value={row.statusOS}
                                    options={statusOptions}
                                    optionLabel="label"
                                    optionValue="value"
                                    onChange={async (e) => {
                                        await ordemServicoService.alterarStatus(row.id, e.value);
                                        carregarOrdensServico();
                                    }}
                                />
                            )}
                        />

                        <Column body={actionTemplate} />

                    </DataTable>

                    {/* DIALOG CRUD */}
                    <Dialog
                        visible={ordemServicoDialog}
                        style={{ width: '450px' }}
                        header="Ordem Serviço"
                        modal
                        footer={
                            <>
                                <Button label="Cancelar" text onClick={hideDialog} />
                                <Button label="Salvar" text onClick={saveOrdemServico} />
                            </>
                        }
                        onHide={hideDialog}
                    >
                        <div className="field">
                            <label>ID da Ocorrência</label>
                            <InputText
                                value={ordemServico.ocorrenciaId}
                                onChange={(e) =>
                                    setOrdemServico({ ...ordemServico, ocorrenciaId: Number(e.target.value) })
                                }
                                className={classNames({ 'p-invalid': submitted && !ordemServico.ocorrenciaId })}
                            />
                        </div>

                        <div className="field">
                            <label>CPF do Técnico</label>
                            <InputText
                                value={ordemServico.cpfTecnico}
                                onChange={(e) =>
                                    setOrdemServico({ ...ordemServico, cpfTecnico: e.target.value })
                                }
                                className={classNames({ 'p-invalid': submitted && !ordemServico.cpfTecnico })}
                            />
                        </div>

                        <div className="field">
                            <label>Descrição</label>
                            <InputText
                                value={ordemServico.descricaoServico}
                                onChange={(e) =>
                                    setOrdemServico({ ...ordemServico, descricaoServico: e.target.value })
                                }
                                className={classNames({ 'p-invalid': submitted && !ordemServico.descricaoServico })}
                            />
                        </div>

                    </Dialog>

                    {/* DELETE */}
                    <Dialog
                        visible={deleteDialog}
                        style={{ width: '450px' }}
                        header="Confirmar Exclusão"
                        modal
                        footer={
                            <>
                                <Button label="Não" text onClick={() => setDeleteDialog(false)} />
                                <Button label="Sim" text onClick={deleteOrdemServico} />
                            </>
                        }
                        onHide={() => setDeleteDialog(false)}
                    >
                        Tem certeza que deseja excluir esta ordem de serviço?
                    </Dialog>

                </div>
            </div>
        </div>
    );
};

export default OrdemServicoPage;
