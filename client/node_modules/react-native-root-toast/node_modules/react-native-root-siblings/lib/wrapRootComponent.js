import React from 'react';
import RootController from './RootController';
import RootSiblings from './RootSiblings';
export default function wrapRootComponent(Root, renderSibling) {
    const controller = new RootController();
    return {
        Root: (props) => {
            return (<RootSiblings controller={controller} renderSibling={renderSibling}>
          <Root {...props}/>
        </RootSiblings>);
        },
        manager: {
            update(id, element, callback) {
                controller.update(id, element, callback);
            },
            destroy(id, callback) {
                controller.destroy(id, callback);
            }
        }
    };
}
//# sourceMappingURL=wrapRootComponent.js.map