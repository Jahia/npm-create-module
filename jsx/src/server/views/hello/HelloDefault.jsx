import React from 'react'
import { useServerContext, getNodeProps } from '@jahia/js-server-core'

export const HelloDefault = () => {
    const { currentNode } = useServerContext();
    const props = getNodeProps(currentNode, ['textHello']);
    return (
        <div>
            <h2>{props.textHello}</h2>
        </div>
    )
}
/*
* jahiaComponent object is used to register the view in Jahia
* name: The name of the template (optional)
* nodeType: The content node type the template applies to
* displayName: The display name of the view (optional)
* componentType: the component type is set to view (as opposed to template component types)
*/
HelloDefault.jahiaComponent = {
    name: 'default',
    nodeType: '$$MODULE_NAMESPACE$$:hello',
    displayName: 'Hello (default)',
    componentType: 'view'
}
