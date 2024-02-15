import React from 'react'
import { useServerContext, getNodeProps } from '@jahia/js-server-engine'

export const HelloComponent = () => {
    const { currentNode } = useServerContext();
    const props = getNodeProps(currentNode, ['textHello']);
    return (
        <div>
            <h2>{props.textHello}</h2>
        </div>
    )
}

HelloComponent.jahiaComponent = { // this object is used to register the view in Jahia
    id: '$$MODULE_NAMESPACE$$_helloComponent', // A globally unique identifier use to register the view
    nodeType: '$$MODULE_NAMESPACE$$:hello', // The content node type the template applies to
    displayName: 'Hello Component', // The display name of the view
    componentType: 'view' // the component type is set to view (as opposed to template component types)
}
