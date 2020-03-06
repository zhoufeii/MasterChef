import { ComponentType, FunctionComponent, ReactNode } from 'react';
export interface RootSiblingManager {
    update(id: string, element: ReactNode, callback?: () => void): void;
    destroy(id: string, callback?: () => void): void;
}
export default function wrapRootComponent<T = {}>(Root: ComponentType<T>, renderSibling?: (sibling: ReactNode) => ReactNode): {
    Root: FunctionComponent<T>;
    manager: RootSiblingManager;
};
