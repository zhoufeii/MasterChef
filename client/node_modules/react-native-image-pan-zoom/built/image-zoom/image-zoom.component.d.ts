import * as React from 'react';
import { LayoutChangeEvent } from 'react-native';
import { ICenterOn, Props, State } from './image-zoom.type';
export default class ImageViewer extends React.Component<Props, State> {
    static defaultProps: Props;
    state: State;
    private lastPositionX;
    private positionX;
    private animatedPositionX;
    private lastPositionY;
    private positionY;
    private animatedPositionY;
    private scale;
    private animatedScale;
    private zoomLastDistance;
    private zoomCurrentDistance;
    private imagePanResponder;
    private lastTouchStartTime;
    private horizontalWholeOuterCounter;
    private swipeDownOffset;
    private horizontalWholeCounter;
    private verticalWholeCounter;
    private centerDiffX;
    private centerDiffY;
    private singleClickTimeout;
    private longPressTimeout;
    private lastClickTime;
    private doubleClickX;
    private doubleClickY;
    private isDoubleClick;
    private isLongPress;
    private isHorizontalWrap;
    componentWillMount(): void;
    resetScale: () => void;
    panResponderReleaseResolve: () => void;
    componentDidMount(): void;
    componentWillReceiveProps(nextProps: Props): void;
    imageDidMove(type: string): void;
    didCenterOnChange(params: {
        x: number;
        y: number;
        scale: number;
        duration: number;
    }, paramsNext: {
        x: number;
        y: number;
        scale: number;
        duration: number;
    }): boolean;
    centerOn(params: ICenterOn): void;
    /**
     * 图片区域视图渲染完毕
     */
    handleLayout(event: LayoutChangeEvent): void;
    /**
     * 重置大小和位置
     */
    reset(): void;
    render(): JSX.Element;
}
