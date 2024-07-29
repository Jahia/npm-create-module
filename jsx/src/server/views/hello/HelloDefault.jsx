import React from 'react'
import {useServerContext, getNodeProps, defineJahiaComponent} from '@jahia/js-server-core'

export const HelloDefault = () => {
    const { currentNode } = useServerContext();
    const props = getNodeProps(currentNode, ['textHello']);
    return (
        <div>
            <h2>{props.textHello}</h2>
        </div>
    )
}

HelloDefault.jahiaComponent = defineJahiaComponent({
    name: 'default',
    nodeType: '$$MODULE_NAMESPACE$$:hello',
    displayName: 'Hello (default)',
    componentType: 'view'
});
