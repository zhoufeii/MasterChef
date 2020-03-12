import "./index.less";

import { View } from "@tarojs/components";
import { Component } from "@tarojs/taro";

export default class Ball extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { ballStyle = {} } = this.props;
        return <View className='ball_wrapper' style={ballStyle}></View>
    }
}