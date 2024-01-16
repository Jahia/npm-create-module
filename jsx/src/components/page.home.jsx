import React from 'react';
import {JRender} from '@jahia/js-server-engine';

export const PageHome = () => {
    return (<>
        <head>
            <title>Home</title>
        </head>
        <body>
            <h1>Home Template</h1>
            <main>
                <JRender content={{
                        name: "pagecontent",
                        nodeType: "jnt:area"
                }}/>
            </main>
        </body>
    </>);
}

PageHome.jahiaComponent = {
    id: 'page_home',
    nodeType: 'jnt:page',
    name: 'home',
    displayName: 'Home React template',
    componentType: 'template'
}