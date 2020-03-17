import "./index.less";

import { AtButton } from "taro-ui";

import { View } from "@tarojs/components";
import { Component } from "@tarojs/taro";

export default class Index extends Component {

    constructor() {
        super();
        this.state = {
            type: +this.$router.params.type || '',
            icon: +this.$router.params.type === 1 ? 'https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/common_icon/check_blue.png' : 'https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/common_icon/clock.png'
        }
    }

    componentWillMount() { }

    componentDidMount() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    config = {
        navigationBarTitleText: '点菜成功！'
    }

    navigateTo = (url) => {
        Taro.navigateTo({
            url
        })
    }

    render() {
        const { icon = '', type = '' } = this.state;
        return (
            <View className='success'>
                <Image className='success_icon' src={icon} />
                <View className='success_tips_wrapper'>
                    <View className='success_tips'>{type === 1 ? '熊家厨房马上开工' : '熊家厨房已收到您的预定'}</View>
                    <View className='success_tips'>{type === 1 ? '您的菜品将在一小时之内送达！' : '您的菜品将在预定时间内送达！'}</View>
                </View>
                <AtButton full={false} type='primary' >订单详情</AtButton>
                <AtButton full={false} type='secondary' >查看我的订单</AtButton>
            </View>
        )
    }
}
