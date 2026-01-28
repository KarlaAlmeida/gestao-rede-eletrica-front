/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '@/types';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model: AppMenuItem[] = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: 'Pages',
            icon: 'pi pi-fw pi-briefcase',
            to: '/pages',
            items: [
            
                {
                    label: 'Login',
                    icon: 'pi pi-fw pi-sign-in',
                    to: '/auth/login'
                },
                
                {
                    label: 'Ativos',
                    icon: 'pi pi-fw pi-box',
                    to: '/pages/ativo'
                },
                {
                    label: 'Técnicos',
                    icon: 'pi pi-fw pi-users',
                    to: '/pages/tecnico'
                },
                {
                    label: 'Ocorrências',
                    icon: 'pi pi-fw pi-exclamation-triangle',
                    to: '/pages/ocorrencia'
                },
                {
                    label: 'Ordens de Serviço',
                    icon: 'pi pi-fw pi-file',
                    to: '/pages/ordemservico'
                },
                
                {
                    label: 'Logout',
                    icon: 'pi pi-fw pi-sign-out',
                    to: '/auth/logout'
                }
            ]
        }
       
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}

 
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
