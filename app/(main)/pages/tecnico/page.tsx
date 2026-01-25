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
import { TecnicoService } from '@/service/TecnicoService';

const TecnicoPage = () => {
    type TecnicoForm = {
        id?: number;
        nome: string;
        cpf: string;
        email: string;
        telefone: string;
        ultimoSalario: number;
        ativo: boolean;
        especialidade: string;
        disponivel: boolean;
        cep: string;
        numero?: string;
    };
    
    const tecnicoVazio: Projeto.Tecnico = {
        id: 0,
        nome: '',
        cpf: '',
        email: '',
        telefone: '',
        especialidade: '',
        ultimoSalario: 0,
        ativo: true,
        disponivel: true,
        cep: '',
        numero: ''
    };

    const [tecnicos, setTecnicos] = useState<Projeto.Tecnico[]>([]);
    const [tecnico, setTecnico] = useState<Projeto.Tecnico>(tecnicoVazio);
    const [tecnicoDialog, setTecnicoDialog] = useState(false);
    const [deleteTecnicoDialog, setDeleteTecnicoDialog] = useState(false);
    const [deleteTecnicosDialog, setDeleteTecnicosDialog] = useState(false);
    const [selectedTecnicos, setSelectedTecnicos] = useState<Projeto.Tecnico[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(10);

    const tecnicoService = new TecnicoService();

    const carregarTecnicos = () => {
        setLoading(true);
        tecnicoService.listar(page, rows)
            .then(res => {
                setTecnicos(res.data.content);
                setTotalRecords(res.data.totalElements);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        carregarTecnicos();
    }, [page, rows]);

    const openNew = () => {
        setTecnico(tecnicoVazio);
        setSubmitted(false);
        setTecnicoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setTecnicoDialog(false);
    };

    const hideDeleteTecnicoDialog = () => {
        setDeleteTecnicoDialog(false);
    };

    const hideDeleteTecnicosDialog = () => {
        setDeleteTecnicosDialog(false);
    };

    const saveTecnico = async () => {
        setSubmitted(true);

        if (!tecnico.nome || !tecnico.cpf || !tecnico.funcao || !tecnico.email || !tecnico.telefone) return;

        try {
            if (tecnico.id) {
                await tecnicoService.atualizar(tecnico.id, tecnico);
            } else {
                await tecnicoService.criar(tecnico);
            }

            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Técnico salvo com sucesso'
            });

            setTecnicoDialog(false);
            carregarTecnicos();
        } catch (err) {
            console.error(err);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao salvar técnico'
            });
        }
    };

    const editTecnico = (row: Projeto.Tecnico) => {
        setTecnico({ ...row });
        setTecnicoDialog(true);
    };

    const confirmDeleteTecnico = (row: Projeto.Tecnico) => {
        setTecnico(row);
        setDeleteTecnicoDialog(true);
    };

    const deleteTecnico = async () => {
        if (!tecnico.id) return;

        try {
            await tecnicoService.excluir(tecnico.id);

            toast.current?.show({
                severity: 'success',
                summary: 'Removido',
                detail: 'Técnico excluído com sucesso'
            });

            setDeleteTecnicoDialog(false);
            carregarTecnicos();
        } catch (err) {
            console.error(err);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao excluir técnico'
            });
        }
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteTecnicosDialog(true);
    };

    const deleteSelectedTecnicos = async () => {
        try {
            await Promise.all(
                selectedTecnicos.map(t => tecnicoService.excluir(t.id))
            );

            toast.current?.show({
                severity: 'success',
                summary: 'Removidos',
                detail: 'Técnicos excluídos com sucesso'
            });

            setDeleteTecnicosDialog(false);
            setSelectedTecnicos([]);
            carregarTecnicos();
        } catch (err) {
            console.error(err);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao excluir técnicos'
            });
        }
    };

    const onInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: keyof Projeto.Tecnico
    ) => {
        setTecnico(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const leftToolbarTemplate = () => (
        <React.Fragment>
            <div className="my-2">
                <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedTecnicos || !selectedTecnicos.length} />
            </div>
        </React.Fragment>
    );

    const rightToolbarTemplate = () => (
        <React.Fragment>
            <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
            <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
        </React.Fragment>
    );

    const actionBodyTemplate = (rowData: Projeto.Tecnico) => (
        <>
            <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editTecnico(rowData)} />
            <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteTecnico(rowData)} />
        </>
    );

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gestão de Técnicos</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const tecnicoDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={saveTecnico} />
        </>
    );

    const deleteTecnicoDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteTecnicoDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteTecnico} />
        </>
    );

    const deleteTecnicosDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteTecnicosDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedTecnicos} />
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
                        value={tecnicos}
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
                        selection={selectedTecnicos}
                        onSelectionChange={(e) => setSelectedTecnicos(e.value)}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} técnicos"
                        globalFilter={globalFilter}
                        emptyMessage="Nenhum técnico encontrado."
                        header={header}
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Código" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="nome" header="Nome" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="cpf" header="CPF" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="funcao" header="Função" sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="email" header="Email" sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="telefone" header="Telefone" sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={tecnicoDialog} style={{ width: '450px' }} header="Detalhes do Técnico" modal className="p-fluid" footer={tecnicoDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nome">Nome</label>
                            <InputText id="nome" value={tecnico.nome} onChange={(e) => onInputChange(e, 'nome')} required autoFocus className={classNames({ 'p-invalid': submitted && !tecnico.nome })} />
                            {submitted && !tecnico.nome && <small className="p-invalid">Nome é obrigatório.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="cpf">CPF</label>
                            <InputText id="cpf" value={tecnico.cpf} onChange={(e) => onInputChange(e, 'cpf')} required className={classNames({ 'p-invalid': submitted && !tecnico.cpf })} />
                            {submitted && !tecnico.cpf && <small className="p-invalid">CPF é obrigatório.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="funcao">Função</label>
                            <InputText id="funcao" value={tecnico.funcao} onChange={(e) => onInputChange(e, 'funcao')} required className={classNames({ 'p-invalid': submitted && !tecnico.funcao })} />
                            {submitted && !tecnico.funcao && <small className="p-invalid">Função é obrigatória.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <InputText id="email" value={tecnico.email} onChange={(e) => onInputChange(e, 'email')} required className={classNames({ 'p-invalid': submitted && !tecnico.email })} />
                            {submitted && !tecnico.email && <small className="p-invalid">Email is obrigatório.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="telefone">Telefone</label>
                            <InputText id="telefone" value={tecnico.telefone} onChange={(e) => onInputChange(e, 'telefone')} required className={classNames({ 'p-invalid': submitted && !tecnico.telefone })} />
                            {submitted && !tecnico.telefone && <small className="p-invalid">Telefone is obrigatório.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteTecnicoDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteTecnicoDialogFooter} onHide={hideDeleteTecnicoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {tecnico && (
                                <span>
                                    Você tem certeza que deseja deletar <b>{tecnico.nome}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteTecnicosDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteTecnicosDialogFooter} onHide={hideDeleteTecnicosDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {tecnico && <span>Você tem certeza que deseja deletar os técnicos selecionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default TecnicoPage;