import React from 'react';
import {JArea, JAddResources} from '@jahia/js-server-engine';

export const PageHome = () => {
    return (<>
        <head>
            <JAddResources type='css' resources='styles.css' />
            <title>Home</title>
        </head>
        <body>
            <h1>Home Template</h1>
            <main>
                <JArea name="pagecontent" />
            </main>
        </body>
    </>);
}

PageHome.jahiaComponent = { // This object is used to register the template in Jahia
    id: '$$MODULE_NAMESPACE$$_page_home', // A globally unique identifier use to register the template
    nodeType: 'jnt:page', // The content node type the template applies to
    name: 'home', // The name of the template
    displayName: 'Home React template', // The display name of the page template
    componentType: 'template' // the component type is set to template (as opposed to view component types)
}