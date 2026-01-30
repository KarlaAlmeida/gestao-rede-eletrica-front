'use client';

import { useEffect, useState } from 'react';
import DashboardService from '@/service/DashboardService';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';

const DashboardPage = () => {

    const [data, setData] = useState<any>(null);

    useEffect(() => {
        DashboardService.obterDashboard().then(res => setData(res.data));
    }, []);


    if (!data) return null;


    const ocorrenciasChart = {
        labels: Object.keys(data.ocorrenciasPorTipoAtivo),
        datasets: [{
            label: 'Ocorrências',
            data: Object.values(data.ocorrenciasPorTipoAtivo)
        }]
    };


    const ordensChart = {
        labels: Object.keys(data.ordensServicoPorTecnico),
        datasets: [{
            label: 'Ordens de Serviço',
            data: Object.values(data.ordensServicoPorTecnico)
        }]
    };


    return (
        <div className="grid">

            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Ativos</span>
                            <div className="text-900 font-medium text-xl">{data.totalAtivos}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-box text-blue-500 text-xl" />
                        </div>
                    </div>
                </div>
            </div>

           <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Técnicos</span>
                            <div className="text-900 font-medium text-xl">{data.totalTecnicos}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-users text-orange-500 text-xl" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Ocorrências</span>
                            <div className="text-900 font-medium text-xl">{data.totalOcorrencias}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-exclamation-triangle text-cyan-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{data.ocorrenciasConcluidas} </span>
                    <span className="text-500">concluídas</span>
                </div>
            </div>

            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Ordens de Serviço</span>
                            <div className="text-900 font-medium text-xl">{data.totalOrdensServico}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-file text-purple-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{data.ordensServicoConcluidas} </span>
                    <span className="text-500">concluídas</span>
                </div>
            </div>

            <div className="col-12 md:col-6">
                <Card title="Ocorrências por Tipo de Ativo">
                    <Chart type="bar" data={ocorrenciasChart} />
                </Card>
            </div>


            <div className="col-12 md:col-6">
                <Card title="Ordens de Serviço por Técnico">
                    <Chart type="bar" data={ordensChart} />
                </Card>
            </div>

        </div>
    );
};

export default DashboardPage;