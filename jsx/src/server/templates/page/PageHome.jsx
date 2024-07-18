import React from 'react';
import {Area, AddResources, defineJahiaComponent} from '@jahia/js-server-core';
import {useTranslation} from 'react-i18next';

export const PageHome = () => {
    const {t} = useTranslation();
    return (<>
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
    </>);
}

/*
* jahiaComponent object is used to register the template in Jahia
* nodeType: The content node type the template applies to
* name: The name of the template (optional)
* displayName: The display name of the page template (optional)
* componentType: the component type is set to template (as opposed to view component types)
*/

PageHome.jahiaComponent = defineJahiaComponent({
    nodeType: 'jnt:page', 
    name: 'home', 
    displayName: 'Home page', 
    componentType: 'template' 
});
