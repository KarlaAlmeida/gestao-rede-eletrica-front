/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Projeto } from '@/types';
import { AtivoService } from '@/service/AtivoService';
import { Dropdown } from 'primereact/dropdown';

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */

const PaginaInicialPage = () => {

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <span>
                        Bem vindo(a) ao Sistema de Gestão de Ativos da Rede Elétrica
                    </span>

                </div>
            </div>
        </div>
    );

};

export default PaginaInicialPage;