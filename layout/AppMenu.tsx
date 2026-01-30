/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '@/types';
import { AuthContext } from './context/authcontext';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const { roles: userRoles } = useContext(AuthContext);

    const model: AppMenuItem[] = [
        {
            label: 'Home',
            items: [{ label: 'Página inicial', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: 'Pages',
            icon: 'pi pi-fw pi-briefcase',
            to: '/pages',
            items: [

                {
                    label: 'Dashboard', 
                    icon: 'pi pi-fw pi-chart-bar', 
                    to: '/pages/dashboard'
                },
                /*{
                    label: 'Login',
                    icon: 'pi pi-fw pi-sign-in',
                    to: '/auth/login'
                },*/

                {
                    label: 'Ativos',
                    icon: 'pi pi-fw pi-box',
                    to: '/pages/ativo',
                    roles: ['ROLE_ADMIN', 'ROLE_USER']
                },
                {
                    label: 'Técnicos',
                    icon: 'pi pi-fw pi-users',
                    to: '/pages/tecnico',
                    roles: ['ROLE_ADMIN', 'ROLE_USER']
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

                /*{
                    label: 'Logout',
                    icon: 'pi pi-fw pi-sign-out',
                    to: '/auth/logout'
                }*/
            ]
        }

    ];

    const isVisible = (item: AppMenuItem) => {
        if (!item.roles) return true;
        return item.roles.some((role) => userRoles.includes(role));
    };

    const filteredModel = model
        .map((section) => ({
            ...section,
            items: section.items?.filter(isVisible)
        }))
        .filter((section) => section.items && section.items.length > 0);

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {filteredModel.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
