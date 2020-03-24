import "./index.less";

import moment from "moment";

import { View } from "@tarojs/components";
import { Component } from "@tarojs/taro";

import Avatar from "../../components/avatar";
import Loading from "../../components/loading";
import { getGlobalData } from "../../utils/globalData";

function formatTime(date) {
    return date.format('YYYY年MM月DD日 HH:mm')
}

export default class Index extends Component {

    constructor() {
        super()
        this.state = {
            env: getGlobalData('env') || '',
            pageNo: 0,
            pageSize: 10,
            noMore: false,
            loading: true,
            initialCompleted: false
        }
    }

    componentWillMount() { }

    componentDidMount() {
        this.handleGetOrderList()
    }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    onReachBottom() {
        console.log("上拉触底事件")
        const { pageNo, noMore = false } = this.state;
        if (!noMore) {
            this.setState({
                pageNo: +pageNo + 1,
                loading: true
            }, this.handleGetOrderList)
        }
    }

    config = {
        navigationBarTitleText: '我的订单',
    }

    handleGetOrderList = () => {
        const { env, pageNo, pageSize, list = [] } = this.state;
        Taro.cloud.callFunction({
            name: 'orders',
            data: { action: 'getOrders', pageNo, pageSize, env },
        }).then(res => {
            console.log(res)
            this.setState({
                loading: false,
                list: list.concat(res.result.data || []),
                noMore: res.result.data && res.result.data.length < pageSize,
                initialCompleted: true
            })
        }).catch(err => {
            showToast('获取订单失败，请联系大熊！')
        })
    }

    navigateTo = (url) => {
        Taro.navigateTo({
            url
        })
    }

    render() {
        const { list = [], loading = true, initialCompleted = false } = this.state;
        return (
            <View className='orderList'>
                <Loading loading={loading} initialCompleted={false} />
                {
                    initialCompleted && list.length ? <View>
                        {
                            list.map(orderItem => {
                                return <View key={orderItem._id} className='order_item_wrapper'>
                                    <View className='order_item_head'>
                                        <View className='shop_name'>熊家厨房【官方直营】</View>
                                        <View className='right_arrow'>
                                            <Image src='https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/common_icon/right_arrow.png' />
                                        </View>
                                    </View>
                                    <View className='order_item_mid'>
                                        <View className='foods_wrapper'>
                                            <ScrollView
                                                className='food_pic_wrapper'
                                                scrollX
                                                scrollAnchoring={true}
                                                scrollWithAnimation={true}
                                                scrollTop={0}
                                            >
                                                {
                                                    orderItem.list.map(item => {
                                                        return <View className='food_pic' key={item.id}>
                                                            <Avatar pic={item.pic} text={item.name} />
                                                        </View>
                                                        // return <Image className='food_pic' key={item.id} src={item.pic} />
                                                    })
                                                }
                                            </ScrollView>
                                        </View>

                                        <View className='food_count'>{`共${orderItem.list.length}道菜`}</View>
                                    </View>
                                    <View className='order_item_bottom'>
                                        <View className='order_item_bottom_item'>
                                            <View className='bottom_item_label'>下单时间</View>
                                            <View className='bottom_item_content'>{formatTime(moment(orderItem.createTime)) || '-'}</View>
                                        </View>
                                        <View className='order_item_bottom_item'>
                                            <View className='bottom_item_label'>送达时间</View>
                                            <View className='bottom_item_content'>{orderItem.deliverDate || '-'}</View>
                                        </View>
                                        {/* <View className='order_item_bottom_item'>
                                            <View></View>
                                            <View className='right_btns'>
                                                <View className='same_more_btn'>再来一顿</View>
                                                <View className='comment_btn'>评价</View>
                                            </View>
                                        </View> */}
                                    </View>
                                </View>
                            })
                        }
                    </View> : null
                }
                {
                    initialCompleted && !list.length ? <View className='empty_wrapper'>
                        <Image className='empty_image' src='https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/common_icon/empty.png' />
                        <View className='empty_text'>兔兔还没有点过菜嗷</View>
                    </View> : null
                }
                {
                    noMore && list.length ? <View className='bottom_line_wrapper'>
                        <View className='bottom_line'></View>
                        <View className='bottom_line_text'>我也是有底线的</View>
                        <View className='bottom_line'></View>
                    </View> : null
                }
            </View>
        )
    }
}
