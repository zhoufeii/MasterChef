import "./index.less";

import { View } from "@tarojs/components";
import { Component } from "@tarojs/taro";

export default class DetailBanner extends Component {
    constructor() {
        super()
        this.state = {

        }
    }

    componentDidMount() {

    }

    render() {
        const { name = '', avatar = '', backgroundPic = '', tips = '', sellCount = 0, rank = 0 } = this.state;
        return <View className='banner_wrapper'>
            <Image className='banner_background' src='https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/common_icon/bear_cut.jpg' />
            <View className='banner'>
                <View className='banner_header'>
                    <View className='banner_name'>熊家厨房</View>
                    <Image className='food_count_icon' src="https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/20140731114009_Jd5HE.png" />
                </View>
                <View className='banner_tips'>本店只接受可爱小兔点菜</View>
                <View className='banner_desc'>本店宗旨：熊家厨房，只做兔子爱吃的菜！</View>
            </View>
        </View>
    }
}