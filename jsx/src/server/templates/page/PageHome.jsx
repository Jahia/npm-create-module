import React from 'react';
import {Area, AddResources, defineJahiaComponent, useServerContext} from '@jahia/js-server-core';
import {useTranslation} from 'react-i18next';

export const PageHome = () => {
    const {t} = useTranslation();
    const {currentResource} = useServerContext();
    const lang = currentResource.getLocale().getLanguage();
    return (<html lang={lang}>
        <head>
            <AddResources type='css' resources='styles.css' />
            <title>Home</title>
        </head>
        <body>
            {/* Using i18next defined in locales */}
            <h1>{t('homeTitle')}</h1>
            <main>
                <Area name="pagecontent" />
            </main>
        </body>
    </html>);
}

PageHome.jahiaComponent = defineJahiaComponent({
    nodeType: 'jnt:page', 
    name: 'home', 
    displayName: 'Home page', 
    componentType: 'template'
});
