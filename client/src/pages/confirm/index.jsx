import "./index.less";

import moment from "moment";
import {
  AtAvatar,
  AtFloatLayout
} from "taro-ui";

import { View } from "@tarojs/components";
import { Component } from "@tarojs/taro";

import { showToast } from "../../utils/index";

function format(date) {
    return date.format('YYYY-MM-DD')
}
const CALENDAR_LOCALE = {
    sameDay: '[今天]',
    nextDay: '[明天]',
    nextWeek: 'dddd',
    lastDay: '[昨天]',
    lastWeek: '[上周]',
    sameElse: 'YYYY年MM月DD日'
}

const WEEK_LOCALE = {
    'Monday': '周一',
    'Tuesday': '周二',
    'Wednesday': '周三',
    'Thursday': '周四',
    'Friday': '周五',
    'Saturday': '周六',
    'Sunday': '周日'
}

export default class Index extends Component {
    constructor() {
        super();
        this.state = {
            deliverDate: 0,
            deliverTime: '',
            showModal: false,
            selectCoupon: false,
            showCouponModal: false,
            price: 0,
        }
    }

    componentWillMount() { }

    componentDidMount() {
        let orderList = [];
        const _this = this;

        let timeList = new Array(24);
        for (let i = 0; i < 24; i++) {
            timeList[i] = ''
        }

        let dateList = [
            {
                id: 0,
                date: moment().calendar(null, CALENDAR_LOCALE),
                dateFormat: format(moment()),
                // timeList: timeList.slice(moment().hours() + 1)
                timeList: timeList.map((item, index) => {
                    return {
                        id: `id_${Math.floor(Math.random() * 10000000)}`,
                        time: index < 10 ? `0${index}:00` : `${index}:00`
                    }
                }).slice(moment().hours() + 1)
            }
        ];

        for (let i = 1; i < 7; i++) {
            dateList.push({
                id: i,
                date: moment().add(i, 'days').calendar(null, CALENDAR_LOCALE),
                dateFormat: format(moment().add(i, 'days')),
                timeList: timeList.map((item, index) => {
                    return {
                        id: `id_${Math.floor(Math.random() * 10000000)}`,
                        time: index < 10 ? `0${index}:00` : `${index}:00`
                    }
                })
            })
        }

        dateList = dateList.map(item => {
            return WEEK_LOCALE[item.date] ? { ...item, date: WEEK_LOCALE[item.date] } : item
        })

        Taro.getStorage({
            key: 'ORDER_LIST',
            success(res) {
                orderList = JSON.parse(res.data)
                let price = (orderList.length || 0) * 99999
                _this.setState({
                    price,
                    orderList,
                    dateList,
                    timeList,
                    deliverTime: timeList[0] && timeList[0][0] && timeList[0][0].id
                }, Taro.clearStorage)
            }
        })
    }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    config = {
        navigationBarTitleText: '点菜确认'
    }

    navigateTo = (url) => {
        Taro.navigateTo({
            url
        })
    }

    redirectTo = (url) => {
        Taro.redirectTo({
            url
        })
    }

    toggleModal = () => {
        const { showModal } = this.state;
        this.setState({
            showModal: !showModal
        })
    }

    toggleCouponModal = () => {
        const { showCouponModal } = this.state;
        this.setState({
            showCouponModal: !showCouponModal
        })
    }

    selectDate = (e) => {
        console.log(e)
    }

    setDate = (item = {}) => {
        this.setState({
            deliverDate: item.id
            // currentDate: item
        })
    }

    setTime = (item = {}) => {
        this.setState({
            deliverTime: item.id,
            showModal: false,
        }, () => {
            const { deliverDate = '', deliverTime = '', dateList = [] } = this.state;
            const date = dateList[deliverDate].dateFormat;
            const time = dateList[deliverDate].timeList.filter(item => item.id === deliverTime)[0].time
            const selectDate = `${date} ${time}`;
            this.setState({
                selectDate
            })
        })
    }

    selectCoupon = () => {
        const { selectCoupon = false } = this.state;
        this.setState({
            selectCoupon: !selectCoupon
        }, this.toggleCouponModal)
    }

    confirmOrder = () => {
        const { selectCoupon = false, selectDate = '' } = this.state;
        if (selectCoupon) {
            this.redirectTo(`/pages/success/index?type=${selectDate ? 1 : 2}`)  // type: [1: 立即送出] [2: 预定单]
        } else {
            showToast('快让爱你的人给你做好吃的吧！')
        }
    }

    render() {
        const { orderList = [], selectCoupon = false, selectDate = '', showModal = false, showCouponModal = false, deliverDate = 0, deliverTime = '', dateList = [], price = 0, } = this.state;
        const timeList = dateList.map(item => item.timeList)
        return (
            <View className='confirm'>
                <View className='confirm_info'>
                    <View className='confirm_title'>
                        <View className='shop_name'>熊家厨房【官方直营】</View>
                        <View className='shop_icon'>大熊专送</View>
                    </View>
                    <View className='confirm_date_wrapper' onClick={this.toggleModal}>
                        {
                            !selectDate ? <View className='confirm_date_label'>立即送出</View> : <View className='confirm_date_label'>指定时间</View>
                        }
                        <View className='confirm_date'>
                            {
                                selectDate ? <View className='show_name'>{selectDate}</View> : null
                            }
                            <View className='right_arrow'>
                                <Image src='https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/common_icon/right_arrow.png' />
                            </View>
                        </View>
                    </View>
                </View>
                <View className='foods'>
                    {
                        orderList.map(item => <View key={item._id} className='item_wrapper'>
                            <View className='item_info'>
                                <AtAvatar size='large' image={item.pics.length && item.pics[0].url || ''} ></AtAvatar>
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
                    <View className='confirm_coupon_wrapper' onClick={this.toggleCouponModal}>
                        {
                            !selectCoupon ? <View className='confirm_coupon_label'>请选择优惠券</View> : <View className='confirm_coupon_label'>使用优惠券</View>
                        }
                        <View className='confirm_coupon'>
                            {
                                selectCoupon ? <View className='show_name'>小兔吃好喝好万能券</View> : null
                            }
                            <View className='right_arrow'>
                                <Image src='https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/common_icon/right_arrow.png' />
                            </View>
                        </View>
                    </View>

                </View>
                <View className='pay_wrapper'>
                    <View className='price'>{`￥${selectCoupon ? 0 : price}`}</View>
                    <View className='pay_btn' onClick={this.confirmOrder}>{selectCoupon ? (!selectDate ? '好饿！立即下单！' : '就预定这些吧！') : '我好像付不起'}</View>
                </View>
                <AtFloatLayout isOpened={showModal} title="请选择送达时间" onClose={this.toggleModal}>
                    <View className='select_modal'>
                        <View className='select_date'>
                            <ScrollView
                                className='select_wrapper'
                                scrollY
                                scrollAnchoring={true}
                                scrollWithAnimation={true}
                                scrollTop={0}
                            >
                                {
                                    dateList.map((item) => <View
                                        key={item.id}
                                        className={deliverDate === item.id ? `date_item active` : `date_item`}
                                        onClick={this.setDate.bind(this, item)}
                                    >
                                        {item.date}
                                    </View>)
                                }
                            </ScrollView>
                        </View>
                        <View className='select_time'>
                            <ScrollView
                                className='select_wrapper'
                                scrollY
                                scrollAnchoring={true}
                                scrollWithAnimation={true}
                                scrollTop={0}
                            >
                                {
                                    timeList[deliverDate] && timeList[deliverDate].map((item) => {
                                        console.log('=====item====')
                                        console.log(deliverTime)
                                        console.log(item.id)
                                        return <View
                                            key={item.id}
                                            className={deliverTime === item.id ? `time_item active` : `time_item`}
                                            onClick={this.setTime.bind(this, item)}
                                        >
                                            {item.time}
                                        </View>
                                    })
                                }
                            </ScrollView>

                        </View>
                    </View>
                </AtFloatLayout>

                <AtFloatLayout isOpened={showCouponModal} title="请选择优惠券" onClose={this.toggleCouponModal}>
                    <View className='coupon_modal'>
                        <View className={selectCoupon ? 'coupon_top active' : 'coupon_top'} onClick={this.selectCoupon}>
                            <View>小兔吃好喝好万能券</View>
                            {
                                selectCoupon ? <Image className='check_icon' src='https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/common_icon/check.png' /> : null
                            }
                        </View>
                        <View className="coupon_bottom">
                            <View>仅限可爱小兔使用</View>
                            <View className='coupon_date'>有效期至<Image className='infinity_icon' src='https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/common_icon/infinity.png' /></View>
                        </View>
                    </View>
                </AtFloatLayout>
            </View>
        )
    }
}
