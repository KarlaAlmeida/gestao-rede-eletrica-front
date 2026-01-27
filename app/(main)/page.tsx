/* eslint-disable @next/next/no-img-element */
'use client';
import { Chart } from 'primereact/chart';
import React, { useContext, useEffect, useState } from 'react';
import { LayoutContext } from '../../layout/context/layoutcontext';
import { Projeto } from '@/types';
import { ChartData, ChartOptions } from 'chart.js';
import { AtivoService } from '@/service/AtivoService';
import { TecnicoService } from '@/service/TecnicoService';
import OcorrenciaService from '@/service/OcorrenciaService';
import OrdemDeServicoService from '@/service/OrdemdeServicoService';

const Dashboard = () => {
    const [totalAtivos, setTotalAtivos] = useState(0);
    const [totalTecnicos, setTotalTecnicos] = useState(0);
    const [totalOcorrencias, setTotalOcorrencias] = useState(0);
    const [ocorrenciasConcluidas, setOcorrenciasConcluidas] = useState(0);
    const [totalOS, setTotalOS] = useState(0);
    const [osConcluidas, setOsConcluidas] = useState(0);

    const [ocorrenciasPorTipo, setOcorrenciasPorTipo] = useState<ChartData>({ labels: [], datasets: [] });
    const [osPorTecnico, setOsPorTecnico] = useState<ChartData>({ labels: [], datasets: [] });

    const [chartOptions, setChartOptions] = useState<ChartOptions>({});
    const { layoutConfig } = useContext(LayoutContext);

    const applyLightTheme = () => {
        const options: ChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };

        setChartOptions(options);
    };

    const applyDarkTheme = () => {
        const options: ChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                }
            }
        };

        setChartOptions(options);
    };

    useEffect(() => {
        if (layoutConfig.colorScheme === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [layoutConfig.colorScheme]);

    useEffect(() => {
        const ativoService = new AtivoService();
        const tecnicoService = new TecnicoService();

        const fetchData = async () => {
            try {
                const [ativosRes, tecnicosRes, ocorrenciasRes, osRes] = await Promise.all([
                    ativoService.listar(0, 1000),
                    tecnicoService.listar(0, 1000),
                    OcorrenciaService.listar(0, 1000),
                    OrdemDeServicoService.listar(0, 1000)
                ]);

                const ativos = ativosRes.data.content;
                const tecnicos = tecnicosRes.data.content;
                const ocorrencias = ocorrenciasRes.data.content;
                const ordensServico = osRes.data.content;

                setTotalAtivos(ativosRes.data.totalElements);
                setTotalTecnicos(tecnicosRes.data.totalElements);
                setTotalOcorrencias(ocorrenciasRes.data.totalElements);
                setTotalOS(osRes.data.totalElements);

                setOcorrenciasConcluidas(ocorrencias.filter((o) => o.statusOcorrencia === 'CONCLUIDA').length);
                setOsConcluidas(ordensServico.filter((os) => os.statusOS === 'CONCLUIDA').length);

                // Ocorrências por Tipo de Ativo
                const ocorrenciasByTipo: { [key: string]: number } = {};
                ocorrencias.forEach((o) => {
                    const tipo = o.ativo?.tipoAtivo || 'Desconhecido';
                    ocorrenciasByTipo[tipo] = (ocorrenciasByTipo[tipo] || 0) + 1;
                });

                setOcorrenciasPorTipo({
                    labels: Object.keys(ocorrenciasByTipo),
                    datasets: [
                        {
                            label: 'Ocorrências',
                            data: Object.values(ocorrenciasByTipo),
                            backgroundColor: '#2f4860',
                            borderColor: '#2f4860',
                            borderWidth: 1
                        }
                    ]
                });

                // OS por Técnico
                const osByTecnico: { [key: string]: number } = {};
                ordensServico.forEach((os) => {
                    const tecnicoNome = os.tecnico?.nome || 'Não atribuído';
                    osByTecnico[tecnicoNome] = (osByTecnico[tecnicoNome] || 0) + 1;
                });

                setOsPorTecnico({
                    labels: Object.keys(osByTecnico),
                    datasets: [
                        {
                            label: 'Ordens de Serviço',
                            data: Object.values(osByTecnico),
                            backgroundColor: '#00bb7e',
                            borderColor: '#00bb7e',
                            borderWidth: 1
                        }
                    ]
                });
            } catch (error) {
                console.error('Erro ao carregar dados do dashboard:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="grid">
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Total de Ativos</span>
                            <div className="text-900 font-medium text-xl">{totalAtivos}</div>
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
                            <span className="block text-500 font-medium mb-3">Total de Técnicos</span>
                            <div className="text-900 font-medium text-xl">{totalTecnicos}</div>
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
                            <div className="text-900 font-medium text-xl">{totalOcorrencias}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-exclamation-triangle text-cyan-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{ocorrenciasConcluidas} </span>
                    <span className="text-500">concluídas</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Ordens de Serviço</span>
                            <div className="text-900 font-medium text-xl">{totalOS}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-file text-purple-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{osConcluidas} </span>
                    <span className="text-500">concluídas</span>
                </div>
            </div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Ocorrências por Tipo de Ativo</h5>
                    <Chart type="bar" data={ocorrenciasPorTipo} options={chartOptions} />
                </div>
            </div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Ordens de Serviço por Técnico</h5>
                    <Chart type="bar" data={osPorTecnico} options={chartOptions} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
