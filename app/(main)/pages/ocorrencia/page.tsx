/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Projeto } from '@/types';
import { OcorrenciaService } from '@/service/OcorrenciaService';
import { AtivoService } from '@/service/AtivoService';
import { Dropdown } from 'primereact/dropdown';

const OcorrenciaPage = () => {
    const ocorrenciaVazia: Projeto.Ocorrencia = {
        id: 0,
        descricao: '',
        data: '',
        status: '',
        ativo: {
            id: 0,
            tipoAtivo: '',
            statusAtivo: '',
            dataInstalacao: '',
            endereco: {}
        }
    };

    const [ocorrencias, setOcorrencias] = useState<Projeto.Ocorrencia[]>([]);
    const [ativos, setAtivos] = useState<Projeto.Ativo[]>([]);
    const [ocorrencia, setOcorrencia] = useState<Projeto.Ocorrencia>(ocorrenciaVazia);
    const [ocorrenciaDialog, setOcorrenciaDialog] = useState(false);
    const [deleteOcorrenciaDialog, setDeleteOcorrenciaDialog] = useState(false);
    const [deleteOcorrenciasDialog, setDeleteOcorrenciasDialog] = useState(false);
    const [selectedOcorrencias, setSelectedOcorrencias] = useState<Projeto.Ocorrencia[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(10);

    const ocorrenciaService = new OcorrenciaService();
    const ativoService = new AtivoService();

    const carregarOcorrencias = () => {
        setLoading(true);
        ocorrenciaService.listar(page, rows)
            .then(res => {
                setOcorrencias(res.data.content);
                setTotalRecords(res.data.totalElements);
            })
            .finally(() => setLoading(false));
    };

    const carregarAtivos = () => {
        ativoService.listar(0, 1000) // Assuming there are less than 1000 ativos
            .then(res => {
                setAtivos(res.data.content);
            });
    };

    useEffect(() => {
        carregarOcorrencias();
        carregarAtivos();
    }, [page, rows]);

    const openNew = () => {
        setOcorrencia(ocorrenciaVazia);
        setSubmitted(false);
        setOcorrenciaDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setOcorrenciaDialog(false);
    };

    const hideDeleteOcorrenciaDialog = () => {
        setDeleteOcorrenciaDialog(false);
    };

    const hideDeleteOcorrenciasDialog = () => {
        setDeleteOcorrenciasDialog(false);
    };

    const saveOcorrencia = async () => {
        setSubmitted(true);

        if (!ocorrencia.descricao || !ocorrencia.data || !ocorrencia.status) return;

        try {
            if (ocorrencia.id) {
                await ocorrenciaService.atualizar(ocorrencia.id, ocorrencia);
            } else {
                await ocorrenciaService.criar(ocorrencia);
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
        setOcorrencia({ ...row });
        setOcorrenciaDialog(true);
    };

    const confirmDeleteOcorrencia = (row: Projeto.Ocorrencia) => {
        setOcorrencia(row);
        setDeleteOcorrenciaDialog(true);
    };

    const deleteOcorrencia = async () => {
        if (!ocorrencia.id) return;

        try {
            await ocorrenciaService.excluir(ocorrencia.id);

            toast.current?.show({
                severity: 'success',
                summary: 'Removido',
                detail: 'Ocorrência excluída com sucesso'
            });

            setDeleteOcorrenciaDialog(false);
            carregarOcorrencias();
        } catch (err) {
            console.error(err);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao excluir ocorrência'
            });
        }
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteOcorrenciasDialog(true);
    };

    const deleteSelectedOcorrencias = async () => {
        try {
            await Promise.all(
                selectedOcorrencias.map(o => ocorrenciaService.excluir(o.id))
            );

            toast.current?.show({
                severity: 'success',
                summary: 'Removidos',
                detail: 'Ocorrências excluídas com sucesso'
            });

            setDeleteOcorrenciasDialog(false);
            setSelectedOcorrencias([]);
            carregarOcorrencias();
        } catch (err) {
            console.error(err);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao excluir ocorrências'
            });
        }
    };

    const onInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: keyof Projeto.Ocorrencia
    ) => {
        setOcorrencia(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const leftToolbarTemplate = () => (
        <React.Fragment>
            <div className="my-2">
                <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedOcorrencias || !selectedOcorrencias.length} />
            </div>
        </React.Fragment>
    );

    const rightToolbarTemplate = () => (
        <React.Fragment>
            <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
            <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
        </React.Fragment>
    );

    const actionBodyTemplate = (rowData: Projeto.Ocorrencia) => (
        <>
            <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editOcorrencia(rowData)} />
            <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteOcorrencia(rowData)} />
        </>
    );

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gestão de Ocorrências</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const ocorrenciaDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={saveOcorrencia} />
        </>
    );

    const deleteOcorrenciaDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteOcorrenciaDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteOcorrencia} />
        </>
    );

    const deleteOcorrenciasDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteOcorrenciasDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedOcorrencias} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

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
                        responsiveLayout="scroll"
                        selection={selectedOcorrencias}
                        onSelectionChange={(e) => setSelectedOcorrencias(e.value)}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} ocorrências"
                        globalFilter={globalFilter}
                        emptyMessage="Nenhuma ocorrência encontrada."
                        header={header}
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Código" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="descricao" header="Descrição" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="data" header="Data" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="status" header="Status" sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={ocorrenciaDialog} style={{ width: '450px' }} header="Detalhes da Ocorrência" modal className="p-fluid" footer={ocorrenciaDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="descricao">Descrição</label>
                            <InputText id="descricao" value={ocorrencia.descricao} onChange={(e) => onInputChange(e, 'descricao')} required autoFocus className={classNames({ 'p-invalid': submitted && !ocorrencia.descricao })} />
                            {submitted && !ocorrencia.descricao && <small className="p-invalid">Descrição is obrigatória.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="data">Data</label>
                            <InputText id="data" value={ocorrencia.data} onChange={(e) => onInputChange(e, 'data')} required className={classNames({ 'p-invalid': submitted && !ocorrencia.data })} />
                            {submitted && !ocorrencia.data && <small className="p-invalid">Data is obrigatória.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="status">Status</label>
                            <InputText id="status" value={ocorrencia.status} onChange={(e) => onInputChange(e, 'status')} required className={classNames({ 'p-invalid': submitted && !ocorrencia.status })} />
                            {submitted && !ocorrencia.status && <small className="p-invalid">Status is obrigatório.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="ativo">Ativo</label>
                            <Dropdown id="ativo" value={ocorrencia.ativo.id} options={ativos.map(a => ({ label: a.tipoAtivo, value: a.id }))} onChange={(e) => setOcorrencia(prev => ({ ...prev, ativo: { ...prev.ativo, id: e.value } }))} placeholder="Selecione um Ativo" className={classNames({ 'p-invalid': submitted && !ocorrencia.ativo.id })} />
                            {submitted && !ocorrencia.ativo.id && <small className="p-invalid">Ativo é obrigatório.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteOcorrenciaDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteOcorrenciaDialogFooter} onHide={hideDeleteOcorrenciaDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {ocorrencia && (
                                <span>
                                    Você tem certeza que deseja deletar <b>{ocorrencia.descricao}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteOcorrenciasDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteOcorrenciasDialogFooter} onHide={hideDeleteOcorrenciasDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {ocorrencia && <span>Você tem certeza que deseja deletar as ocorrências selecionadas?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default OcorrenciaPage;
