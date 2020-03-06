import { Component, ReactChild, ReactNode } from 'react';
import RootController from './RootController';
interface RootSiblingsProps {
    controller: RootController;
    renderSibling?: (sibling: ReactNode) => ReactNode;
    children: ReactChild;
}
interface RootSiblingsState {
    siblings: Array<{
        id: string;
        element: ReactNode;
    }>;
}
export default class extends Component<RootSiblingsProps, RootSiblingsState> {
    private updatedSiblings;
    private siblingsPool;
    constructor(props: RootSiblingsProps);
    componentDidMount(): void;
    componentDidUpdate(): void;
    render(): JSX.Element;
    private commitChange;
    private invokeCallback;
    private renderSiblings;
    private wrapSibling;
}
export {};
