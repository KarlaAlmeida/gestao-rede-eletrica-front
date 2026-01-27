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

    const tecnicoVazio: Projeto.TecnicoPayload = {
        nome: '',
        cpf: '',
        email: '',
        telefone: '',
        especialidade: '',
        ultimoSalario: 0,
        ativo: true,
        disponivel: true,
        cep: '',
        numero: undefined,
        complementoNumero: ''
    };


    const [tecnicos, setTecnicos] = useState<Projeto.Tecnico[]>([]);
    const [tecnicoId, setTecnicoId] = useState<number | null>(null);
    const [tecnico, setTecnico] = useState<Projeto.TecnicoPayload>(tecnicoVazio);
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

        if (!tecnico.nome || !tecnico.cpf.replace(/\D/g, '') || !tecnico.email || !tecnico.telefone.replace(/\D/g, '') || !tecnico.especialidade || !tecnico.cep.replace(/\D/g, '')) {
            return;
        }

        try {
            if (tecnicoId !== null) {
                await tecnicoService.atualizar(tecnicoId, tecnico);
            } else {
                await tecnicoService.criar(tecnico);
            }

            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Técnico salvo com sucesso'
            });

            setTecnicoDialog(false);
            setTecnicoId(null);
            carregarTecnicos();

        } catch {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao salvar técnico'
            });
        }
    };



    const editTecnico = (row: Projeto.Tecnico) => {
        setTecnicoId(row.id);
        setTecnico({
            nome: row.nome,
            cpf: row.cpf,
            email: row.email,
            telefone: row.telefone,
            especialidade: row.especialidade,
            ultimoSalario: row.ultimoSalario,
            ativo: row.ativo,
            disponivel: row.disponivel,
            cep: row.endereco?.cep ?? '',
            numero: undefined,
            complementoNumero: ''
        });
        setTecnicoDialog(true);
    };


    const confirmDeleteTecnico = (row: Projeto.Tecnico) => {
        setTecnico(row);
        setDeleteTecnicoDialog(true);
    };


    const deleteTecnico = async () => {
        if (tecnicoId === null) return;

        try {
            await tecnicoService.excluir(tecnicoId);

            toast.current?.show({
                severity: 'success',
                summary: 'Removido',
                detail: 'Técnico excluído com sucesso'
            });

            setDeleteTecnicoDialog(false);
            setTecnicoId(null);
            carregarTecnicos();
        } catch {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao excluir técnico'
            });
        }
    };


    const inativarTecnico = async (id: number) => {
        try {
            await tecnicoService.inativar(id);

            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Técnico inativado'
            });

            carregarTecnicos();
        } catch {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao inativar técnico'
            });
        }
    };

    const toggleAtivoTecnico = async (tecnico: Projeto.Tecnico) => {
        try {
            if (tecnico.ativo) {
                await tecnicoService.inativar(tecnico.id);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Técnico inativado'
                });
            } else {
                await tecnicoService.reativar(tecnico.id);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Técnico reativado'
                });
            }

            carregarTecnicos();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao alterar status do técnico'
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
        field: keyof Projeto.TecnicoPayload
    ) => {
        setTecnico(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };


    /*const leftToolbarTemplate = () => (
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
    );*/

    const actionBodyTemplate = (rowData: Projeto.Tecnico) => (
        <>
            <Button
                icon="pi pi-pencil"
                rounded
                className="mr-2"
                onClick={() => editTecnico(rowData)}
            />
            <Button
                icon="pi pi-trash"
                rounded
                severity="danger"
                onClick={() => confirmDeleteTecnico(rowData)}
            />

            <Button
                icon={rowData.ativo ? 'pi pi-ban' : 'pi pi-check'}
                rounded
                severity={rowData.ativo ? 'secondary' : 'success'}
                className="mr-2"
                tooltip={rowData.ativo ? 'Inativar Técnico' : 'Reativar Técnico'}
                onClick={async () => {
                    try {
                        await tecnicoService.alterarStatus(
                            rowData.id,
                            !rowData.ativo
                        );

                        toast.current?.show({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: rowData.ativo
                                ? 'Técnico inativado com sucesso'
                                : 'Técnico reativado com sucesso'
                        });

                        carregarTecnicos();
                    } catch (error) {
                        console.error(error);
                        toast.current?.show({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Erro ao alterar status do técnico'
                        });
                    }
                }}
            />

            <Button
                icon={rowData.disponivel ? 'pi pi-user-minus' : 'pi pi-user-plus'}
                rounded
                severity={rowData.disponivel ? 'warning' : 'info'}
                className="mr-2"
                tooltip={
                    rowData.disponivel
                        ? 'Marcar como indisponível'
                        : 'Marcar como disponível'
                }
                onClick={async () => {
                    try {
                        await tecnicoService.alterarDisponibilidade(
                            rowData.id,
                            !rowData.disponivel
                        );

                        toast.current?.show({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: rowData.disponivel
                                ? 'Técnico marcado como indisponível'
                                : 'Técnico marcado como disponível'
                        });

                        carregarTecnicos();
                    } catch (error) {
                        console.error(error);
                        toast.current?.show({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Erro ao alterar disponibilidade'
                        });
                    }
                }}
            />

        </>
    );


    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gestão de Técnicos</h5>

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
                    <Toolbar
                        className="mb-4"
                        left={() => (
                            <Button label="Novo Técnico" icon="pi pi-plus" onClick={openNew} />
                        )}
                    />

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
                        <Column field="especialidade" header="Especialidade" sortable />
                        <Column field="cpf" header="CPF" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="email" header="Email" sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="telefone" header="Telefone" sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="ativo" header="Ativo" body={(row) => row.ativo ? 'Sim' : 'Não'} />
                        <Column field="disponivel" header="Disponível" body={(row) => row.disponivel ? 'Sim' : 'Não'} />
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
                            <InputText id="cpf" value={tecnico.cpf.replace(/\D/g, '')} onChange={(e) => onInputChange(e, 'cpf')} required className={classNames({ 'p-invalid': submitted && !tecnico.cpf.replace(/\D/g, '') })} />
                            {submitted && !tecnico.cpf.replace(/\D/g, '') && <small className="p-invalid">CPF é obrigatório.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="especialidade">Especialidade</label>
                            <InputText id="especialidade" maxLength={30} value={tecnico.especialidade} onChange={(e) => onInputChange(e, 'especialidade')} required className={classNames({ 'p-invalid': submitted && !tecnico.especialidade })} />
                            {submitted && !tecnico.especialidade && <small className="p-invalid">Função é obrigatória.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <InputText id="email" value={tecnico.email} onChange={(e) => onInputChange(e, 'email')} required className={classNames({ 'p-invalid': submitted && !tecnico.email })} />
                            {submitted && !tecnico.email && <small className="p-invalid">Email is obrigatório.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="telefone">Telefone</label>
                            <InputText id="telefone" value={tecnico.telefone.replace(/\D/g, '')} onChange={(e) => onInputChange(e, 'telefone')} required className={classNames({ 'p-invalid': submitted && !tecnico.telefone.replace(/\D/g, '') })} />
                            {submitted && !tecnico.telefone.replace(/\D/g, '') && <small className="p-invalid">Telefone is obrigatório.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="cep">CEP</label>
                            <InputText
                                id="cep"
                                value={tecnico.cep.replace(/\D/g, '')}
                                onChange={(e) => setTecnico(prev => ({ ...prev, cep: e.target.value }))}
                                placeholder="00000-000"
                                className={classNames({ 'p-invalid': submitted && !tecnico.cep.replace(/\D/g, '') })}
                            />
                            {submitted && !tecnico.cep.replace(/\D/g, '') && <small className="p-invalid">CEP obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="numero">Número</label>
                            <InputText
                                id="numero"
                                value={tecnico.numero ?? ''}
                                onChange={(e) => setTecnico(prev => ({ ...prev, numero: Number(e.target.value) }))}
                                placeholder="Opcional"
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="complementoNumero">Complemento</label>
                            <InputText
                                id="complementoNumero"
                                value={tecnico.complementoNumero ?? ''}
                                onChange={(e) =>
                                    setTecnico(prev => ({ ...prev, complementoNumero: e.target.value }))
                                }
                            />
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