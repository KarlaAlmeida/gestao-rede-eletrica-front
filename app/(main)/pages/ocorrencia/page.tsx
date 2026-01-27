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

import { Projeto } from '@/types';
import ocorrenciaService from '@/service/OcorrenciaService';

const OcorrenciasPage = () => {

    /* =======================
       STATE
    ======================= */
    const ocorrenciaVazia = {
        ativoId: 0,
        descricaoOcorrencia: '',
        prioridadeOcorrencia: 'MEDIA'
    };

    const [ocorrencias, setOcorrencias] = useState<Projeto.Ocorrencia[]>([]);
    const [ocorrenciaDialog, setOcorrenciaDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [ocorrencia, setOcorrencia] = useState<any>(ocorrenciaVazia);
    const [ocorrenciaId, setOcorrenciaId] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');

    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    /* =======================
       OPTIONS
    ======================= */
    const prioridadeOptions = [
        { label: 'Baixa', value: 'BAIXA' },
        { label: 'Média', value: 'MEDIA' },
        { label: 'Alta', value: 'ALTA' },
        { label: 'Crítica', value: 'CRITICA' }
    ];

    const statusOptions = [
        { label: 'Registrada', value: 'REGISTRADA' },
        { label: 'Encaminhada', value: 'ENCAMINHADA' },
        { label: 'Concluída', value: 'CONCLUIDA' }
    ];

    /* =======================
       LOAD
    ======================= */
    const carregarOcorrencias = () => {
        setLoading(true);
        ocorrenciaService.listar(page, rows)
            .then(res => {
                setOcorrencias(res.data.content);
                setTotalRecords(res.data.totalElements);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        carregarOcorrencias();
    }, [page, rows]);

    /* =======================
       CRUD ACTIONS
    ======================= */
    const openNew = () => {
        setOcorrencia(ocorrenciaVazia);
        setOcorrenciaId(null);
        setSubmitted(false);
        setOcorrenciaDialog(true);
    };

    const hideDialog = () => {
        setOcorrenciaDialog(false);
        setSubmitted(false);
    };

    const saveOcorrencia = async () => {
        setSubmitted(true);

        if (
            !ocorrencia.descricaoOcorrencia ||
            !ocorrencia.ativoId ||
            !ocorrencia.prioridadeOcorrencia
        ) return;

        const payload = {
            ativoId: ocorrencia.ativoId,
            descricaoOcorrencia: ocorrencia.descricaoOcorrencia,
            prioridadeOcorrencia: ocorrencia.prioridadeOcorrencia
        };

        console.log("Payload enviado:", payload); // DEBUG

        try {
            if (ocorrenciaId) {
                await ocorrenciaService.atualizar(ocorrenciaId, payload);
            } else {
                await ocorrenciaService.criar(payload);
            }

            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Ocorrência salva com sucesso'
            });

            setOcorrenciaDialog(false);
            carregarOcorrencias();

        } catch (err) {
            console.error(err);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao salvar ocorrência'
            });
        }
    };


    const editOcorrencia = (row: Projeto.Ocorrencia) => {
        setOcorrenciaId(row.id);
        setOcorrencia({
            ativoId: row.ativo.id,
            descricaoOcorrencia: row.descricaoOcorrencia,
            prioridadeOcorrencia: row.prioridadeOcorrencia
        });
        setOcorrenciaDialog(true);
    };

    const confirmDelete = (row: Projeto.Ocorrencia) => {
        setOcorrenciaId(row.id);
        setDeleteDialog(true);
    };

    const deleteOcorrencia = async () => {
        if (!ocorrenciaId) return;

        try {
            await ocorrenciaService.excluir(ocorrenciaId);
            toast.current?.show({
                severity: 'success',
                summary: 'Excluída',
                detail: 'Ocorrência removida'
            });
            setDeleteDialog(false);
            carregarOcorrencias();
        } catch {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao excluir ocorrência'
            });
        }
    };

    /* =======================
       TEMPLATES
    ======================= */
    const header = (
        <div className="flex justify-content-between align-items-center">
            <h5 className="m-0">Gestão de Ocorrências</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const actionTemplate = (row: Projeto.Ocorrencia) => (
        <>
            <Button
                icon="pi pi-pencil"
                rounded
                className="mr-2"
                onClick={() => editOcorrencia(row)}
            />
            <Button
                icon="pi pi-trash"
                rounded
                severity="danger"
                onClick={() => confirmDelete(row)}
            />
        </>
    );

    /* =======================
       RENDER
    ======================= */
    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">

                    <Toast ref={toast} />

                    <Toolbar
                        className="mb-4"
                        left={() => (
                            <Button label="Nova Ocorrência" icon="pi pi-plus" onClick={openNew} />
                        )}
                    />

                    <DataTable
                        ref={dt}
                        value={ocorrencias}
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
                        emptyMessage="Nenhuma ocorrência encontrada"
                    >

                        <Column field="id" header="ID" sortable />
                        <Column field="descricaoOcorrencia" header="Descrição" sortable />
                        <Column field="ativo.tipoAtivo" header="Ativo" />
                        <Column
                            header="Prioridade"
                            body={(row) => (
                                <Dropdown
                                    value={row.prioridadeOcorrencia}
                                    options={prioridadeOptions}
                                    onChange={async (e) => {
                                        await ocorrenciaService.atualizar(row.id, {
                                            ...ocorrenciaVazia,
                                            ativoId: row.ativo.id,
                                            descricaoOcorrencia: row.descricaoOcorrencia,
                                            prioridadeOcorrencia: e.value
                                        });
                                        carregarOcorrencias();
                                    }}
                                />
                            )}
                        />
                        <Column
                            header="Status"
                            body={(row) => (
                                <Dropdown
                                    value={row.statusOcorrencia}
                                    options={statusOptions}
                                    onChange={async (e) => {
                                        await ocorrenciaService.alterarStatus(row.id, e.value);
                                        carregarOcorrencias();
                                    }}
                                />
                            )}
                        />
                        <Column field="dataRegistroOcorrencia" header="Data" />
                        <Column body={actionTemplate} />

                    </DataTable>

                    {/* DIALOG CRUD */}
                    <Dialog
                        visible={ocorrenciaDialog}
                        style={{ width: '450px' }}
                        header="Ocorrência"
                        modal
                        footer={
                            <>
                                <Button label="Cancelar" text onClick={hideDialog} />
                                <Button label="Salvar" text onClick={saveOcorrencia} />
                            </>
                        }
                        onHide={hideDialog}
                    >
                        <div className="field">
                            <label>Descrição</label>
                            <InputText
                                value={ocorrencia.descricaoOcorrencia}
                                onChange={(e) =>
                                    setOcorrencia({ ...ocorrencia, descricaoOcorrencia: e.target.value })
                                }
                                className={classNames({ 'p-invalid': submitted && !ocorrencia.descricaoOcorrencia })}
                            />
                        </div>

                        <div className="field">
                            <label>ID do Ativo</label>
                            <InputText
                                value={ocorrencia.ativoId}
                                onChange={(e) =>
                                    setOcorrencia({ ...ocorrencia, ativoId: Number(e.target.value) })
                                }
                                className={classNames({ 'p-invalid': submitted && !ocorrencia.ativoId })}
                            />
                        </div>

                        <div className="field">
                            <label>Prioridade</label>
                            <Dropdown
                                value={ocorrencia.prioridadeOcorrencia}
                                options={prioridadeOptions}
                                onChange={(e) =>
                                    setOcorrencia({ ...ocorrencia, prioridadeOcorrencia: e.value })
                                }
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
                                <Button label="Sim" text onClick={deleteOcorrencia} />
                            </>
                        }
                        onHide={() => setDeleteDialog(false)}
                    >
                        Tem certeza que deseja excluir esta ocorrência?
                    </Dialog>

                </div>
            </div>
        </div>
    );
};

export default OcorrenciasPage;
