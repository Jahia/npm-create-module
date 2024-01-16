import React from 'react'
import { useServerContext } from '@jahia/js-server-engine'

export const HelloComponent = () => {
    const { currentResource } = useServerContext();
    return (
        <div>
            <h1>{currentResource.getNode().getPropertyAsString('textHello')}</h1>
        </div>
    )
}

HelloComponent.jahiaComponent = {
    id: 'helloComponent',
    target: '$$MODULE_NAMESPACE$$:hello',
    displayName: 'Hello Component'
}
