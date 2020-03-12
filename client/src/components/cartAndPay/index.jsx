import "./index.less";

import {
  Image,
  View
} from "@tarojs/components";
import { Component } from "@tarojs/taro";

export default class Ball extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { count = {} } = this.props;
        return <View className='bottom_wrapper'>
            <View className='bottom_inner'>
                <View className='cart'>
                    <Image src='https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/common_icon/cart_blue.png' />
                </View>
                <View className='pay_btn'>去结算</View>
            </View>
        </View>
    }
}