import React, { Component } from 'react';
import StaticContainer from 'static-container';
import { RootControllerChanges } from './RootController';
export default class extends Component {
    constructor(props) {
        super(props);
        this.updatedSiblings = new Set();
        this.siblingsPool = [];
        this.state = {
            siblings: []
        };
    }
    componentDidMount() {
        this.props.controller.setCallback((id, change) => {
            setImmediate(() => this.commitChange(id, change));
        });
    }
    componentDidUpdate() {
        this.updatedSiblings.clear();
    }
    render() {
        return (<>
        {this.props.children}
        {this.renderSiblings()}
      </>);
    }
    commitChange(id, { change, element, updateCallback }) {
        const siblings = Array.from(this.siblingsPool);
        const index = siblings.findIndex(sibling => sibling.id === id);
        if (change === RootControllerChanges.Remove) {
            if (index > -1) {
                siblings.splice(index, 1);
            }
            else {
                this.invokeCallback(updateCallback);
                return;
            }
        }
        else if (change === RootControllerChanges.Update) {
            if (index > -1) {
                siblings.splice(index, 1, {
                    element,
                    id
                });
                this.updatedSiblings.add(id);
            }
            else {
                this.invokeCallback(updateCallback);
                return;
            }
        }
        else {
            if (index > -1) {
                siblings.splice(index, 1);
            }
            siblings.push({
                element,
                id
            });
            this.updatedSiblings.add(id);
        }
        this.siblingsPool = siblings;
        this.setState({
            siblings
        }, () => this.invokeCallback(updateCallback));
    }
    invokeCallback(callback) {
        if (callback) {
            callback();
        }
    }
    renderSiblings() {
        return this.state.siblings.map(({ id, element }) => {
            return (<StaticContainer key={`root-sibling-${id}`} shouldUpdate={this.updatedSiblings.has(id)}>
          {this.wrapSibling(element)}
        </StaticContainer>);
        });
    }
    wrapSibling(element) {
        const { renderSibling } = this.props;
        if (renderSibling) {
            return renderSibling(element);
        }
        else {
            return element;
        }
    }
}
//# sourceMappingURL=RootSiblings.js.map