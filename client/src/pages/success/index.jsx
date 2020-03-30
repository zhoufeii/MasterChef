import "./index.less";

import { AtButton } from "taro-ui";

import { View } from "@tarojs/components";
import { Component } from "@tarojs/taro";

const RABBIT_TALK = [
    '有光的时候，不想学习',
    '你要是闭上眼睛，我就把你叫醒',
    '兔子扮鸽子，像个小傻子。定睛仔细看，还是小兔子',
    '可能因为新鲜，兔子没上过班',
    '我觉得大阪烧蛮奇怪的，应该好吃',
    '好无聊呀鸽鸽，好想粗去丸',
    '僵尸失望地离开了你的脑子',
    '那个不会有人偷的，除非是小偷',
    '我一会儿就去【瘫倒】',
]

export default class Index extends Component {

    constructor() {
        super();
        this.state = {
            id: this.$router.params.id || '',
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
        const { id = '', icon = '', type = '' } = this.state;
        return (
            <View className='success'>
                <Image className='success_icon' src={icon} />
                <View className='success_tips_wrapper'>
                    <View className='success_tips'>{type === 1 ? '熊家厨房马上开工' : '熊家厨房已收到您的预定'}</View>
                    <View className='success_tips'>{type === 1 ? '您的菜品将在一小时之内送达！' : '您的菜品将在预定时间内送达！'}</View>
                </View>
                <View className='rabbit_say'>【兔言兔语】{RABBIT_TALK[Math.floor(Math.random() * 9)]}</View>
                <AtButton full={false} type='primary' onClick={this.navigateTo.bind(this, `/pages/orderDetail/index?id=${id}`)}>订单详情</AtButton>
                <AtButton full={false} type='secondary' onClick={this.navigateTo.bind(this, `/pages/orderList/index`)}>查看我的订单</AtButton>
            </View>
        )
    }
}
