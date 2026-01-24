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
import { OrdemdeServicoService } from '@/service/OrdemdeServicoService';
import { TecnicoService } from '@/service/TecnicoService';
import { OcorrenciaService } from '@/service/OcorrenciaService';
import { Dropdown } from 'primereact/dropdown';

const OrdemDeServicoPage = () => {
    const ordemDeServicoVazia: Projeto.OrdemDeServico = {
        id: 0,
        descricao: '',
        data: '',
        status: '',
        tecnico: {
            id: 0,
            nome: '',
            cpf: '',
            funcao: '',
            email: '',
            telefone: ''
        },
        ocorrencia: {
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
        }
    };

    const [ordensDeServico, setOrdensDeServico] = useState<Projeto.OrdemDeServico[]>([]);
    const [tecnicos, setTecnicos] = useState<Projeto.Tecnico[]>([]);
    const [ocorrencias, setOcorrencias] = useState<Projeto.Ocorrencia[]>([]);
    const [ordemDeServico, setOrdemDeServico] = useState<Projeto.OrdemDeServico>(ordemDeServicoVazia);
    const [ordemDeServicoDialog, setOrdemDeServicoDialog] = useState(false);
    const [deleteOrdemDeServicoDialog, setDeleteOrdemDeServicoDialog] = useState(false);
    const [deleteOrdensDeServicoDialog, setDeleteOrdensDeServicoDialog] = useState(false);
    const [selectedOrdensDeServico, setSelectedOrdensDeServico] = useState<Projeto.OrdemDeServico[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(10);

    const ordemDeServicoService = new OrdemdeServicoService();
    const tecnicoService = new TecnicoService();
    const ocorrenciaService = new OcorrenciaService();

    const carregarOrdensDeServico = () => {
        setLoading(true);
        ordemDeServicoService.listar(page, rows)
            .then(res => {
                setOrdensDeServico(res.data.content);
                setTotalRecords(res.data.totalElements);
            })
            .finally(() => setLoading(false));
    };

    const carregarTecnicos = () => {
        tecnicoService.listar(0, 1000) // Assuming there are less than 1000 tecnicos
            .then(res => {
                setTecnicos(res.data.content);
            });
    };

    const carregarOcorrencias = () => {
        ocorrenciaService.listar(0, 1000) // Assuming there are less than 1000 ocorrencias
            .then(res => {
                setOcorrencias(res.data.content);
            });
    };

    useEffect(() => {
        carregarOrdensDeServico();
        carregarTecnicos();
        carregarOcorrencias();
    }, [page, rows]);

    const openNew = () => {
        setOrdemDeServico(ordemDeServicoVazia);
        setSubmitted(false);
        setOrdemDeServicoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setOrdemDeServicoDialog(false);
    };

    const hideDeleteOrdemDeServicoDialog = () => {
        setDeleteOrdemDeServicoDialog(false);
    };

    const hideDeleteOrdensDeServicoDialog = () => {
        setDeleteOrdensDeServicoDialog(false);
    };

    const saveOrdemDeServico = async () => {
        setSubmitted(true);

        if (!ordemDeServico.descricao || !ordemDeServico.data || !ordemDeServico.status) return;

        try {
            if (ordemDeServico.id) {
                await ordemDeServicoService.atualizar(ordemDeServico.id, ordemDeServico);
            } else {
                await ordemDeServicoService.criar(ordemDeServico);
            }

            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Ordem de Serviço salva com sucesso'
            });

            setOrdemDeServicoDialog(false);
            carregarOrdensDeServico();
        } catch (err) {
            console.error(err);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao salvar Ordem de Serviço'
            });
        }
    };

    const editOrdemDeServico = (row: Projeto.OrdemDeServico) => {
        setOrdemDeServico({ ...row });
        setOrdemDeServicoDialog(true);
    };

    const confirmDeleteOrdemDeServico = (row: Projeto.OrdemDeServico) => {
        setOrdemDeServico(row);
        setDeleteOrdemDeServicoDialog(true);
    };

    const deleteOrdemDeServico = async () => {
        if (!ordemDeServico.id) return;

        try {
            await ordemDeServicoService.excluir(ordemDeServico.id);

            toast.current?.show({
                severity: 'success',
                summary: 'Removido',
                detail: 'Ordem de Serviço excluída com sucesso'
            });

            setDeleteOrdemDeServicoDialog(false);
            carregarOrdensDeServico();
        } catch (err) {
            console.error(err);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao excluir Ordem de Serviço'
            });
        }
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteOrdensDeServicoDialog(true);
    };

    const deleteSelectedOrdensDeServico = async () => {
        try {
            await Promise.all(
                selectedOrdensDeServico.map(o => ordemDeServicoService.excluir(o.id))
            );

            toast.current?.show({
                severity: 'success',
                summary: 'Removidos',
                detail: 'Ordens de Serviço excluídas com sucesso'
            });

            setDeleteOrdensDeServicoDialog(false);
            setSelectedOrdensDeServico([]);
            carregarOrdensDeServico();
        } catch (err) {
            console.error(err);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao excluir Ordens de Serviço'
            });
        }
    };

    const onInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: keyof Projeto.OrdemDeServico
    ) => {
        setOrdemDeServico(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const leftToolbarTemplate = () => (
        <React.Fragment>
            <div className="my-2">
                <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedOrdensDeServico || !selectedOrdensDeServico.length} />
            </div>
        </React.Fragment>
    );

    const rightToolbarTemplate = () => (
        <React.Fragment>
            <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
            <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
        </React.Fragment>
    );

    const actionBodyTemplate = (rowData: Projeto.OrdemDeServico) => (
        <>
            <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editOrdemDeServico(rowData)} />
            <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteOrdemDeServico(rowData)} />
        </>
    );

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gestão de Ordens de Serviço</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const ordemDeServicoDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={saveOrdemDeServico} />
        </>
    );

    const deleteOrdemDeServicoDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteOrdemDeServicoDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteOrdemDeServico} />
        </>
    );

    const deleteOrdensDeServicoDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteOrdensDeServicoDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedOrdensDeServico} />
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
                        value={ordensDeServico}
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
                        selection={selectedOrdensDeServico}
                        onSelectionChange={(e) => setSelectedOrdensDeServico(e.value)}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} Ordens de Serviço"
                        globalFilter={globalFilter}
                        emptyMessage="Nenhuma Ordem de Serviço encontrada."
                        header={header}
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Código" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="descricao" header="Descrição" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="data" header="Data" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="status" header="Status" sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={ordemDeServicoDialog} style={{ width: '450px' }} header="Detalhes da Ordem de Serviço" modal className="p-fluid" footer={ordemDeServicoDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="descricao">Descrição</label>
                            <InputText id="descricao" value={ordemDeServico.descricao} onChange={(e) => onInputChange(e, 'descricao')} required autoFocus className={classNames({ 'p-invalid': submitted && !ordemDeServico.descricao })} />
                            {submitted && !ordemDeServico.descricao && <small className="p-invalid">Descrição is obrigatória.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="data">Data</label>
                            <InputText id="data" value={ordemDeServico.data} onChange={(e) => onInputChange(e, 'data')} required className={classNames({ 'p-invalid': submitted && !ordemDeServico.data })} />
                            {submitted && !ordemDeServico.data && <small className="p-invalid">Data is obrigatória.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="status">Status</label>
                            <InputText id="status" value={ordemDeServico.status} onChange={(e) => onInputChange(e, 'status')} required className={classNames({ 'p-invalid': submitted && !ordemDeServico.status })} />
                            {submitted && !ordemDeServico.status && <small className="p-invalid">Status is obrigatório.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="tecnico">Técnico</label>
                            <Dropdown id="tecnico" value={ordemDeServico.tecnico.id} options={tecnicos.map(t => ({ label: t.nome, value: t.id }))} onChange={(e) => setOrdemDeServico(prev => ({ ...prev, tecnico: { ...prev.tecnico, id: e.value } }))} placeholder="Selecione um Técnico" className={classNames({ 'p-invalid': submitted && !ordemDeServico.tecnico.id })} />
                            {submitted && !ordemDeServico.tecnico.id && <small className="p-invalid">Técnico é obrigatório.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="ocorrencia">Ocorrência</label>
                            <Dropdown id="ocorrencia" value={ordemDeServico.ocorrencia.id} options={ocorrencias.map(o => ({ label: o.descricao, value: o.id }))} onChange={(e) => setOrdemDeServico(prev => ({ ...prev, ocorrencia: { ...prev.ocorrencia, id: e.value } }))} placeholder="Selecione uma Ocorrência" className={classNames({ 'p-invalid': submitted && !ordemDeServico.ocorrencia.id })} />
                            {submitted && !ordemDeServico.ocorrencia.id && <small className="p-invalid">Ocorrência é obrigatória.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteOrdemDeServicoDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteOrdemDeServicoDialogFooter} onHide={hideDeleteOrdemDeServicoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {ordemDeServico && (
                                <span>
                                    Você tem certeza que deseja deletar <b>{ordemDeServico.descricao}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteOrdensDeServicoDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteOrdensDeServicoDialogFooter} onHide={hideDeleteOrdensDeServicoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {ordemDeServico && <span>Você tem certeza que deseja deletar as Ordens de Serviço selecionadas?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default OrdemDeServicoPage;