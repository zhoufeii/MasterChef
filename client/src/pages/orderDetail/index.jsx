import "./index.less";

import moment from "moment";
import { AtAvatar } from "taro-ui";

import { View } from "@tarojs/components";
import { Component } from "@tarojs/taro";

import { getGlobalData } from "../../utils/globalData";
import { showToast } from "../../utils/index";

function formatTime(date) {
    return date.format('YYYY-MM-DD HH:mm')
}

export default class Index extends Component {

    constructor() {
        super();
        this.state = {
            env: getGlobalData('env') || '',
            id: this.$router.params.id || '',
            orderDetail: {},
            loading: false
        }
    }

    componentWillMount() { }

    componentDidMount() {
        const { id = '', env } = this.state;
        Taro.cloud.callFunction({
            name: 'orders',
            data: { id, action: 'getOrder', env },
        }).then(res => {
            console.log(res)
            console.log(res.result.data[0])
            this.setState({
                loading: false,
                orderDetail: res.result.data[0]
            })
        }).catch(err => {
            showToast('获取订单失败，请联系大熊！')
        })
    }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    config = {
        navigationBarTitleText: '订单详情'
    }

    navigateTo = (url) => {
        Taro.navigateTo({
            url
        })
    }

    render() {
        const { orderDetail = {} } = this.state;
        const { list = [], createTime = '', deliverDate = '', note = '' } = orderDetail;
        return (
            <View className='orderDetail'>
                <View className='foods'>
                    <View className='shop_info' onClick={this.navigateTo.bind(this, `/pages/menu/index`)}>
                        <View className='shop_name'>熊家厨房【官方直营】</View>
                        <View className='right_arrow'>
                            <Image src='https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/common_icon/right_arrow.png' />
                        </View>
                    </View>
                    {
                        list.map(item => <View key={item._id} className='item_wrapper'>
                            <View className='item_info'>
                                <AtAvatar size='large' image={item.pic || ''} ></AtAvatar>
                                <View className='food_item'>
                                    <View className='food_name'>{item.name}</View>
                                    <View className='food_desc'>{item.desc}</View>
                                </View>
                            </View>
                            <View className='item_price'>
                                <View className='item_count'>x {item.count} </View>
                                <View>￥99999</View>
                            </View>
                        </View>)
                    }
                    <View className='confirm_coupon_wrapper' style={{ borderTop: '1px solid #f0f0f0' }}>
                        <View className='confirm_coupon_label'>原价</View>
                        <View className='extra_info black'>{`￥${list.length * 99999}`}</View>
                    </View>
                    <View className='confirm_coupon_wrapper'>
                        <View className='confirm_coupon_label'>使用优惠券</View>
                        <View className='extra_info'>小兔吃好喝好券</View>
                    </View>
                    <View className='confirm_coupon_wrapper'>
                        <View className='confirm_coupon_label'>小计</View>
                        <View className='extra_info black'>0</View>
                    </View>
                </View>
                <View className='order_info'>
                    <View className='order_info_title'>配送信息</View>
                    <View className='order_info_order_time'>
                        <View>下单时间</View>
                        <View className='order_info_extra'>{formatTime(moment(createTime)) || '-'}</View>
                    </View>
                    <View className='order_info_except_time'>
                        <View>期望送达时间</View>
                        <View className='order_info_extra'>{deliverDate || '-'}</View>
                    </View>
                    <View className='order_info_address'>
                        <View>配送地址</View>
                        <View className='order_info_extra'>小兔面前的桌子</View>
                    </View>
                    <View className='order_info_service'>
                        <View>配送服务</View>
                        <View className='order_info_extra'>大熊专送</View>
                    </View>
                    <View className='order_info_man'>
                        <View>厨师&配送</View>
                        <View className='order_info_extra'>帅气熊一只</View>
                    </View>
                </View>
                <View className='notes'>
                    <View className='notes_title'>备注</View>
                    <View className='notes_content'>{note ? `小兔说：${note || ''}` : '小兔没有说什么'}</View>
                </View>
            </View>
        )
    }
}
