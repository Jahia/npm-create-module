import React from 'react';
import {Area, AddResources} from '@jahia/js-server-engine';

export const PageHome = () => {
    return (<>
        <head>
            <AddResources type='css' resources='styles.css' />
            <title>Home</title>
        </head>
        <body>
            <h1>Home Template</h1>
            <main>
                <Area name="pagecontent" />
            </main>
        </body>
    </>);
}

PageHome.jahiaComponent = { // This object is used to register the template in Jahia
    nodeType: 'jnt:page', // The content node type the template applies to
    name: 'home', // The name of the template
    displayName: 'Home page', // The display name of the page template
    componentType: 'template' // the component type is set to template (as opposed to view component types)
}