import { ViewStyle } from 'react-native';
export interface ICenterOn {
    x: number;
    y: number;
    scale: number;
    duration: number;
}
interface IOnMove {
    type: string;
    positionX: number;
    positionY: number;
    scale: number;
    zoomCurrentDistance: number;
}
export interface IOnClick {
    locationX: number;
    locationY: number;
    pageX: number;
    pageY: number;
}
export declare class Props {
    /**
     * 操作区域宽度
     */
    cropWidth: number;
    /**
     * 操作区域高度
     */
    cropHeight: number;
    /**
     * 图片宽度
     */
    imageWidth: number;
    /**
     * 图片高度
     */
    imageHeight: number;
    /**
     * 单手是否能移动图片
     */
    panToMove?: boolean;
    /**
     * 多手指是否能缩放
     */
    pinchToZoom?: boolean;
    /**
     * 双击能否放大
     */
    enableDoubleClickZoom?: boolean;
    /**
     * 单击最大位移
     */
    clickDistance?: number;
    /**
     * 最大滑动阈值
     */
    maxOverflow?: number;
    /**
     * 长按的阈值（毫秒）
     */
    longPressTime?: number;
    /**
     * 双击计时器最大间隔
     */
    doubleClickInterval?: number;
    /**
     * If provided this will cause the view to zoom and pan to the center point
     * Duration is optional and defaults to 300 ms.
     */
    centerOn?: ICenterOn;
    style?: ViewStyle;
    /**
     * threshold for firing swipe down function
     */
    swipeDownThreshold?: number;
    /**
     * for enabling vertical movement if user doesn't want it
     */
    enableSwipeDown?: boolean;
    /**
     * for disabling focus on image center if user doesn't want it
     */
    enableCenterFocus?: boolean;
    /**
     * minimum zoom scale
     */
    minScale?: number;
    /**
     * maximum zoom scale
     */
    maxScale?: number;
    /**
     * 单击的回调
     */
    onClick?: (eventParams: IOnClick) => void;
    /**
     * 双击的回调
     */
    onDoubleClick?: () => void;
    /**
     * 长按的回调
     */
    onLongPress?: () => void;
    /**
     * 横向超出的距离，父级做图片切换时，可以监听这个函数
     * 当此函数触发时，可以做切换操作
     */
    horizontalOuterRangeOffset?: (offsetX?: number) => void;
    /**
     * 触发想切换到左边的图，向左滑动速度超出阈值时触发
     */
    onDragLeft?: () => void;
    /**
     * 松手但是没有取消看图的回调
     */
    responderRelease?: (vx?: number, scale?: number) => void;
    /**
     * If provided, this will be called everytime the map is moved
     */
    onMove?: (position?: IOnMove) => void;
    /**
     * If provided, this method will be called when the onLayout event fires
     */
    layoutChange?: (event?: object) => void;
    /**
     * function that fires when user swipes down
     */
    onSwipeDown?: () => void;
}
export declare class State {
    /**
     * 中心 x 坐标
     */
    centerX?: number;
    /**
     * 中心 y 坐标
     */
    centerY?: number;
}
export {};
