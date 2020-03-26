import "./index.less";

import moment from "moment";
import {
  AtFloatLayout,
  AtModal
} from "taro-ui";

import { View } from "@tarojs/components";
import { Component } from "@tarojs/taro";

import Avatar from "../../components/avatar";
import Loading from "../../components/loading";
import { getGlobalData } from "../../utils/globalData";
import { showToast } from "../../utils/index";

function format(date) {
    return date.format('YYYY年MM月DD日 HH:mm')
}
const TEMPLATE_ID = 'TSNZjgYEW2qm9ZDYFXnL5qm6rwGCvO3VQ_cimHIYR6E'
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
            env: getGlobalData('env') || '',
            USER_TYPE: getGlobalData('USER_TYPE'),
            OTHERS: getGlobalData('OTHERS'),
            orderList: [],
            deliverIndex: 0,
            deliverTime: '',
            showModal: false,
            selectCoupon: false,
            showCouponModal: false,
            price: 0,
            note: '',
            loading: false,
            showTipsModal: false
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

        dateList = dateList.filter(item => {
            return item.timeList.length
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

    setDate = (item = {}) => {
        this.setState({
            deliverIndex: item.id
            // currentDate: item
        })
    }

    setTime = (item = {}) => {
        this.setState({
            deliverTime: item.id,
            showModal: false,
        }, () => {
            const { deliverIndex = '', deliverTime = '', dateList = [] } = this.state;
            let date = dateList[deliverIndex].dateFormat;
            const time = dateList[deliverIndex].timeList.filter(item => item.id === deliverTime)[0].time;
            date = `${date.split(' ')[0]} ${time}`
            // const deliverDate = date.split(' ')[1] = time;
            console.log(date)
            this.setState({
                deliverDate: date
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
        const _this = this;
        const { selectCoupon = false, deliverDate = '', note = '', orderList = [], env } = _this.state;

        const list = orderList.map(item => {
            return {
                id: item._id,
                count: item.count,
                name: item.name,
                desc: item.desc,
                pic: item.pics.length && item.pics[0].url || ''
            }
        })
        const data = {
            deliverDate: deliverDate || '尽快送达',
            list,
            note,
        }
        if (selectCoupon) {
            Taro.requestSubscribeMessage({  // 必须在点击事件中调用！！不能放在回调函数中！！
                tmplIds: [TEMPLATE_ID], // 此处可填写多个模板 ID，但低版本微信不兼容只能授权一个
                success(res) {
                    console.log('已授权接收订阅消息')
                    _this.setState({
                        loading: true
                    }, () => {
                        Taro.cloud.callFunction({
                            name: 'orders',
                            data: { ...data, action: 'addOrder', env },
                        }).then(res => {
                            _this.setState({
                                loading: false
                            }, () => {
                                const orderId = res && res.result && res.result._id || '';
                                Taro.cloud.callFunction({
                                    name: 'subscribeMessage',
                                    data: {
                                        action: 'addSubscribeMessage',
                                        page: `pages/orderDetail/index?id=${orderId}`,
                                        env,
                                        list,
                                        deliverDate: deliverDate || format(moment().add(40, 'minutes')),
                                        templateId: TEMPLATE_ID,
                                    },
                                }).then(res => {
                                    console.log('增加订阅消息成功')
                                }).catch(err => {
                                    console.log(err)
                                })

                                Taro.cloud.callFunction({
                                    name: 'subscribeMessage',
                                    data: {
                                        action: 'sendSubscribeMessage',
                                        env,
                                    },
                                }).then(res => {
                                    console.log('发送订阅消息成功')
                                }).catch(err => {
                                    console.log(err)
                                })

                                _this.redirectTo(`/pages/success/index?type=${!deliverDate ? 1 : 2}&id=${orderId}`)  // type: [1: 立即送出] [2: 预定单]
                            })
                        }).catch(err => {
                            showToast('下单失败，请联系大熊！')
                        })
                    })
                }
            })
        } else {
            this.setState({
                showTipsModal: true
            })
        }
    }

    render() {
        const { showTipsModal = false, loading = false, orderList = [], selectCoupon = false, deliverDate = '', showModal = false, showCouponModal = false, deliverIndex = 0, deliverTime = '', dateList = [], price = 0, note = '', USER_TYPE, OTHERS } = this.state;
        const timeList = dateList.map(item => item.timeList)
        return (
            <View className='confirm'>
                {/* 使用 cover-view */}
                <Loading loading={loading} initialCompleted={false} />
                <View className='confirm_top'>
                    <View className='confirm_info'>
                        <View className='confirm_title'>
                            <View className='shop_name'>熊家厨房【官方直营】</View>
                            <View className='shop_icon'>大熊专送</View>
                        </View>
                        <View className='confirm_date_wrapper' onClick={this.toggleModal}>
                            {
                                !deliverDate ? <View className='confirm_date_label'>立即送出</View> : <View className='confirm_date_label'>指定时间</View>
                            }
                            <View className='confirm_date'>
                                {
                                    deliverDate ? <View className='extra_info'>{deliverDate}</View> : null
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
                                    <Avatar pic={item.pics.length && item.pics[0].url || ''} text={item.name} />
                                    <View className='food_item'>
                                        <View className='food_name'>{item.name}</View>
                                        <View className='food_desc'>大熊说：{item.desc}</View>
                                    </View>
                                </View>
                                <View className='item_price'>
                                    <View className='item_count'>x {item.count} </View>
                                    <View>￥99999</View>
                                </View>
                            </View>)
                        }
                        {
                            USER_TYPE && USER_TYPE !== OTHERS ? <View className='confirm_coupon_wrapper' onClick={this.toggleCouponModal}>
                                {
                                    !selectCoupon ? <View className='confirm_coupon_label'>请选择优惠券</View> : <View className='confirm_coupon_label'>使用优惠券</View>
                                }
                                <View className='confirm_coupon'>
                                    {
                                        selectCoupon ? <View className='extra_info'>小兔吃好喝好券</View> : null
                                    }
                                    <View className='right_arrow'>
                                        <Image src='https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/common_icon/right_arrow.png' />
                                    </View>
                                </View>
                            </View> : null
                        }
                    </View>
                    <View className='note' onClick={this.navigateTo.bind(this, `/pages/note/index?note=${encodeURI(note)}`)}>
                        <View className='note_label'>备注</View>
                        <View className='note_content_wrapper'>
                            {
                                note ? <View className='note_content'>{note}</View> : null
                            }
                            <View className='right_arrow'>
                                <Image src='https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/common_icon/right_arrow.png' />
                            </View>
                        </View>
                    </View>
                </View>

                <View className='pay_wrapper'>
                    <View className='price'>{`￥${selectCoupon ? 0 : price}`}</View>
                    <View className='pay_btn' onClick={this.confirmOrder}>{selectCoupon ? (!deliverDate ? '好饿！立即下单！' : '就预定这些吧！') : '我好像付不起'}</View>
                </View>

                <AtModal
                    isOpened={showTipsModal}
                    title=''
                    cancelText=''
                    confirmText='确定'
                    onConfirm={() => {
                        this.setState({
                            showTipsModal: false
                        })
                    }}
                    content='你不是我的可爱小兔,&#10;快让爱你的人给你做好吃的吧！'
                />

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
                                        className={deliverIndex === item.id ? `date_item active` : `date_item`}
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
                                    timeList[deliverIndex] && timeList[deliverIndex].map((item) => {
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
                            <View>小兔吃好喝好券</View>
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
