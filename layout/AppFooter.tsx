/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <div className="layout-footer">
            <i className="pi pi-bolt" style={{ fontSize: '2rem', color: 'orange' }}></i>
            <span className="font-medium ml-2">by Karla Almeida adaptaded from PrimeReact</span>
        </div>
    );
};

export default AppFooter;
