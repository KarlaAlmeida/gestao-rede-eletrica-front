/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { ProductService } from '../../../../demo/service/ProductService';
import { Projeto } from '@/types';
import { AtivoService } from '@/service/AtivoService';
import { Dropdown } from 'primereact/dropdown';

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */

const AtivoPage = () => {
    type AtivoForm = {
        id?: number;
        tipoAtivo: string;
        statusAtivo: string;
        dataInstalacao: string;
        cep: string;
        numero?: string;
    };

    const ativoVazio: AtivoForm = {
        tipoAtivo: '',
        statusAtivo: '',
        dataInstalacao: '',
        cep: '',
        numero: ''
    };

    // tabela
    const [ativos, setAtivos] = useState<Projeto.Ativo[]>([]);
    const [ativosSelecionados, setAtivosSelecionados] = useState<Projeto.Ativo[]>([]);
    const [ativoSelecionado, setAtivoSelecionado] = useState<Projeto.Ativo | null>(null);

    // formulário
    const [ativo, setAtivo] = useState<AtivoForm>(ativoVazio);

    // UI
    const [ativoDialog, setAtivoDialog] = useState(false);
    const [deleteAtivoDialog, setDeleteAtivoDialog] = useState(false);
    const [deleteAtivosDialog, setDeleteAtivosDialog] = useState(false);


    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(10);

    const [selectedAtivos, setSelectedAtivos] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    const ativoService = new AtivoService();

    const carregarAtivos = () => {
        setLoading(true);

        ativoService.listar(page, rows)
            .then(res => {
                setAtivos(res.data.content);
                setTotalRecords(res.data.totalElements);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        carregarAtivos();
    }, [page, rows]);

    /*useEffect(() => {
        ativoService.listar()
            .then((response) => {
                setAtivos(response.data.content);
            })
            .catch(console.error);
    }, []);*/

    const openNew = () => {
        setAtivo(ativoVazio);
        setSubmitted(false);
        setAtivoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setAtivoDialog(false);
    };

    const hideDeleteAtivoDialog = () => {
        setDeleteAtivoDialog(false);
    };

    const hideDeleteAtivosDialog = () => {
        setDeleteAtivosDialog(false);
    };


    const saveAtivo = async () => {
        setSubmitted(true);

        if (!ativo.tipoAtivo || !ativo.dataInstalacao || !ativo.cep) return;

        const payload = {
            tipoAtivo: ativo.tipoAtivo,
            dataInstalacao: ativo.dataInstalacao,
            cep: ativo.cep.replace('-', '')
        };

        try {
            if (ativo.id !== undefined) {
                await ativoService.atualizar(ativo.id, payload);
            } else {
                await ativoService.criar(payload);
            }

            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Ativo salvo com sucesso'
            });

            setAtivoDialog(false);
            carregarAtivos();
        } catch (err) {
            console.error(err);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao salvar ativo'
            });
        }
    };



    const editAtivo = (row: Projeto.Ativo) => {
        setAtivo({
            id: row.id,
            tipoAtivo: row.tipoAtivo,
            statusAtivo: row.statusAtivo,
            dataInstalacao: row.dataInstalacao,
            cep: row.endereco?.cep || '',
            numero: ''
        });
        setAtivoDialog(true);
    };


    const confirmDeleteAtivo = (row: Projeto.Ativo) => {
        setAtivoSelecionado(row);
        setDeleteAtivoDialog(true);
    };

    const deleteAtivo = async () => {
        if (!ativoSelecionado?.id) return;

        try {
            await ativoService.excluir(ativoSelecionado.id);

            toast.current?.show({
                severity: 'success',
                summary: 'Removido',
                detail: 'Ativo excluído com sucesso'
            });

            setDeleteAtivoDialog(false);
            setAtivoSelecionado(null);
            carregarAtivos();
        } catch (err) {
            console.error(err);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao excluir ativo'
            });
        }
    };


    /*const findIndexById = (id: string) => {
        let index = -1;
        for (let i = 0; i < (products as any)?.length; i++) {
            if ((products as any)[i].id === id) {
                index = i;
                break;
            }
        }
    
        return index;
    };*/

    /*const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };*/

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        if (!ativosSelecionados.length) return;
        setDeleteAtivosDialog(true);
    };

    const deleteSelectedAtivos = async () => {
        try {
            await Promise.all(
                ativosSelecionados.map(a => ativoService.excluir(a.id))
            );

            toast.current?.show({
                severity: 'success',
                summary: 'Removidos',
                detail: 'Ativos excluídos com sucesso'
            });

            setDeleteAtivosDialog(false);
            setAtivosSelecionados([]);
            carregarAtivos();
        } catch (err) {
            console.error(err);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao excluir ativos'
            });
        }
    };

    /*const onCategoryChange = (e: RadioButtonChangeEvent) => {
        let _product = { ...product };
        _product['category'] = e.value;
        setProduct(_product);
    };*/

    const onInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: keyof Projeto.Ativo
    ) => {
        setAtivo(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };


    /*const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
        const val = e.value || 0;
        let _product = { ...product };
        _product[`${name}`] = val;
    
        setProduct(_product);
    };*/

    /*const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedAtivos || !(selectedAtivos as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };*/

    const idBodyTemplate = (rowData: Projeto.Ativo) => {
        return (
            <>
                <span className="p-column-title">Código</span>
                {rowData.id}
            </>
        );
    };

    const tipoAtivoBodyTemplate = (rowData: Projeto.Ativo) => {
        return (
            <>
                <span className="p-column-title">Tipo Ativo</span>
                {rowData.tipoAtivo}
            </>
        );
    };

    const statusBodyTemplate = (rowData: Projeto.Ativo) => (
        <>
            <span className="p-column-title">Status</span>
            <span className={`product-badge status-${rowData.statusAtivo.toLowerCase()}`}>
                {rowData.statusAtivo}
            </span>
        </>
    );

    const statusOptions = [
        { label: 'ATIVO', value: 'ATIVO' },
        { label: 'INATIVO', value: 'INATIVO' },
        { label: 'EM_MANUTENCAO', value: 'EM_MANUTENCAO' }
    ];

    const dataInstalacaoAtivoBodyTemplate = (rowData: Projeto.Ativo) => {
        return (
            <>
                <span className="p-column-title">Data Instalação</span>
                {rowData.dataInstalacao}
            </>
        );
    };

    const tipoAtivoOptions = [
        { label: 'POSTE', value: 'POSTE' },
        { label: 'TRANSFORMADOR', value: 'TRANSFORMADOR' },
        { label: 'CHAVE_FUSIVEL', value: 'CHAVE_FUSIVEL' },
        { label: 'PARA_RAIOS', value: 'PARA_RAIOS' },
        { label: 'REGULADOR', value: 'REGULADOR' }
    ];


    const enderecoAtivoBodyTemplate = (rowData: Projeto.Ativo) => (
        <>
            <span className="p-column-title">Endereço</span>
            {rowData.endereco
                ? `${rowData.endereco.logradouro}, ${rowData.endereco.numero} - ${rowData.endereco.bairro}`
                : ''}
        </>
    );

    const enderecoBody = (row: Projeto.Ativo) =>
        row.endereco
            ? `${row.endereco.logradouro}, ${row.endereco.numero}`
            : '';


    const actionBodyTemplate = (rowData: Projeto.Ativo) => {
        return (
            <>
                <Button
                    icon="pi pi-pencil"
                    rounded
                    className="mr-2"
                    onClick={() => editAtivo(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    severity="danger"
                    onClick={() => confirmDeleteAtivo(rowData)}
                />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gestão de Ativos</h5>

        </div>
    );

    const ativoDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={saveAtivo} />
        </>
    );
    const deleteAtivoDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteAtivoDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteAtivo} />
        </>
    );
    const deleteAtivosDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteAtivosDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedAtivos} />
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
                            <Button label="Novo Ativo" icon="pi pi-plus" onClick={openNew} />
                        )}
                    />

                    <DataTable
                        ref={dt}
                        value={ativos}
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
                        selection={ativosSelecionados}
                        onSelectionChange={(e) => setAtivosSelecionados(e.value)}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} ativos"
                        globalFilter={globalFilter}
                        emptyMessage="Nenhum ativo encontrado."
                        header={header}
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Código" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="tipoAtivo" header="Tipo de Ativo" sortable body={tipoAtivoBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="statusAtivo" header="Status" body={statusBodyTemplate} />
                        <Column field="dataInstalacao" header="Data Instalação" body={dataInstalacaoAtivoBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="endereco" header="Endereço" body={enderecoBody} sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={ativoDialog} style={{ width: '450px' }} header="Detalhes de Ativos" modal className="p-fluid" footer={ativoDialogFooter} onHide={hideDialog}>

                        <div className="field">
                            <label htmlFor="tipoAtivo">Tipo Ativo</label>

                            <Dropdown
                                id="tipoAtivo"
                                value={ativo.tipoAtivo}
                                options={tipoAtivoOptions}
                                onChange={(e) =>
                                    setAtivo(prev => ({ ...prev, tipoAtivo: e.value }))
                                }
                                placeholder="Selecione o tipo de ativo"
                                className={classNames({
                                    'p-invalid': submitted && !ativo.tipoAtivo
                                })}
                            />

                            {submitted && !ativo.tipoAtivo && (
                                <small className="p-invalid">Tipo Ativo é obrigatório.</small>
                            )}
                        </div>


                        <div className="field">
                            <label htmlFor="statusAtivo">Status</label>

                            <Dropdown
                                id="statusAtivo"
                                value={ativo.statusAtivo}
                                options={statusOptions}
                                onChange={(e) =>
                                    setAtivo(prev => ({ ...prev, statusAtivo: e.value }))
                                }
                                placeholder="Selecione o status"
                                className={classNames({
                                    'p-invalid': submitted && !ativo.statusAtivo
                                })}
                            />

                            {submitted && !ativo.statusAtivo && (
                                <small className="p-invalid">Status do ativo é obrigatório.</small>
                            )}
                        </div>


                        <div className="field">
                            <label htmlFor="dataInstalacao">Data Instalação</label>
                            <InputText
                                id="dataInstalacao"
                                type="date"
                                value={ativo.dataInstalacao}
                                onChange={(e) => onInputChange(e, 'dataInstalacao')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !ativo.dataInstalacao
                                })}
                            />
                            {submitted && !ativo.dataInstalacao && <small className="p-invalid">Data de instalação é obrigatória.</small>}
                        </div>



                        <div className="field">
                            <label htmlFor="cep">CEP</label>

                            <InputText
                                id="cep"
                                value={ativo.cep}
                                onChange={(e) =>
                                    setAtivo(prev => ({ ...prev, cep: e.target.value }))
                                }
                                placeholder="00000-000"
                                className={classNames({
                                    'p-invalid': submitted && !ativo.cep
                                })}
                            />

                            {submitted && !ativo.cep && (
                                <small className="p-invalid">CEP é obrigatório.</small>
                            )}
                        </div>

                        <div className="field">
                            <label htmlFor="numero">Número</label>

                            <InputText
                                id="numero"
                                value={ativo.numero}
                                onChange={(e) =>
                                    setAtivo(prev => ({ ...prev, numero: e.target.value }))
                                }
                                placeholder="Opcional"
                            />
                        </div>


                    </Dialog>

                    <Dialog visible={deleteAtivoDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteAtivoDialogFooter} onHide={hideDeleteAtivoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {ativo && (
                                <span>
                                    Você tem certeza que deseja deletar <b>{ativo.tipoAtivo}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteAtivosDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteAtivosDialogFooter} onHide={hideDeleteAtivosDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {ativo && <span>Você tem certeza que deseja deletar os ativos selecionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default AtivoPage;
