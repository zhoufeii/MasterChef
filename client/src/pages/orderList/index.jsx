import "./index.less";

import { View } from "@tarojs/components";
import { Component } from "@tarojs/taro";

import { getGlobalData } from "../../utils/globalData";

export default class Index extends Component {

    constructor() {
        super()
        this.state = {
            env: getGlobalData('env') || '',
            pageNo: 0,
            pageSize: 10,
            noMore: false
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
        const { pageNo, pageSize, noMore = false } = this.state;
        if (!noMore) {
            this.setState({
                pageNo: +pageNo + 1
            }, this.handleGetOrderList)
        }
    }

    config = {
        navigationBarTitleText: '我的订单',
    }

    handleGetOrderList = () => {
        const { env, pageNo, pageSize, list = [], noMore = false } = this.state;
        Taro.cloud.callFunction({
            name: 'orders',
            data: { action: 'getOrders', pageNo, pageSize, env },
        }).then(res => {
            console.log(res)
            this.setState({
                list: list.concat(res.result.data || []),
                noMore: res.result.data && res.result.data.length < pageSize
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
        const { list = [] } = this.state;
        return (
            <View className='orderList'>
                {
                    list.length ? <View>
                        {
                            list.map(orderItem => {
                                return <View key={orderItem._id} className='order_item_wrapper'>
                                    <View className='order_item_head'>
                                        <View>熊家厨房【官方直营】</View>
                                    </View>
                                    <View className='order_item_mid'>
                                        <View className='food_pic_wrapper'>
                                            {
                                                orderItem.list.map(item => {
                                                    return <Image className='food_pic' key={item.id} src={item.pic} />
                                                })
                                            }
                                        </View>
                                        <View className='food_count'>{`共${orderItem.list.length}道菜`}</View>
                                    </View>
                                    <View className='order_item_bottom'>
                                        <View>评价</View>
                                    </View>
                                </View>
                            })
                        }
                    </View> : <View>还没有点过菜</View>
                }
                {
                    noMore ? <View className='bottom_line'>我也是有底线的</View> : null
                }
            </View>
        )
    }
}
