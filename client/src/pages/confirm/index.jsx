import "./index.less";

import moment from "moment";
import {
  AtAvatar,
  AtFloatLayout
} from "taro-ui";

import { View } from "@tarojs/components";
import { Component } from "@tarojs/taro";

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
    'Monday': '下周一',
    'Tuesday': '下周二',
    'Wednesday': '下周三',
    'Thursday': '下周四',
    'Friday': '下周五',
    'Saturday': '下周六',
    'Sunday': '下周日'
}

export default class Index extends Component {
    constructor() {
        super();
        this.state = {}
    }

    componentWillMount() { }

    componentDidMount() {
        let orderList = [];
        const _this = this;

        let timeList = new Array(24);
        for (let i = 0; i < 24; i++) {
            timeList[i] = {
                id: `id_${Math.floor(Math.random() * 10000)}`,
                time: i < 10 ? `0${i}:00` : `${i}:00`
            }
        }

        let dateList = [
            {
                id: 1,
                date: moment().calendar(null, CALENDAR_LOCALE),
                dateFormat: format(moment()),
                timeList: timeList.slice(moment().hours() + 1)
            }
        ];

        for (let i = 0; i < 5; i++) {
            dateList.push({
                id: i + 2,
                date: moment().add(i + 2, 'days').calendar(null, CALENDAR_LOCALE),
                dateFormat: format(moment().add(i + 2, 'days')),
                timeList
            })
        }
        console.log(dateList)

        dateList = dateList.map(item => {
            return WEEK_LOCALE[item.date] ? { ...item, date: WEEK_LOCALE[item.date] } : item
        })
        console.log(dateList)

        Taro.getStorage({
            key: 'ORDER_LIST',
            success(res) {
                orderList = JSON.parse(res.data)
                _this.setState({
                    orderList,
                    dateList,
                    timeList,
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

    toggleModal = () => {
        const { showModal } = this.state;
        this.setState({
            showModal: !showModal
        })
    }

    selectDate = (e) => {
        console.log(e)
    }

    setDate = (item) => {
        this.setState({
            deliverDate: item.id
        })
    }

    setTime = (item) => {
        this.setState({
            deliverTime: item.id
        })
    }

    render() {
        const { orderList = [], selectDate = '', showModal = false, deliverDate = '', deliverTime = '', dateList = [], } = this.state;
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
                                    dateList.map(item => <View
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
                                    timeList.map(item => <View
                                        key={item.id}
                                        className={deliverTime === item.id ? `time_item active` : `time_item`}
                                        onClick={this.setTime.bind(this, item)}
                                    >
                                        {item.time}
                                    </View>)
                                }
                            </ScrollView>

                        </View>
                    </View>
                </AtFloatLayout>
            </View>
        )
    }
}
