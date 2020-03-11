import "./index.less";

import {
  AtActivityIndicator,
  AtAvatar,
  AtMessage,
  AtTabs,
  AtTabsPane
} from "taro-ui";

import {
  Image,
  View
} from "@tarojs/components";
import Taro, { Component } from "@tarojs/taro";

import { getGlobalData } from "../../utils/globalData";

export default class DetailBanner extends Component {

    constructor() {
        super();
        this.state = {
            current: 0,
            loading: true,
            sysList: [],
            currentFoodList: [],
            env: getGlobalData('env') || ''
        }
    }

    onShowMessage = (type = '') => {
        Taro.atMessage({
            message: '消息通知',
            type,
        })
    }

    onToggleCurrent = (current) => {
        const { sysList = [] } = this.state;
        this.setState({
            current,
            currentFoodList: sysList[current] && sysList[current].containFoods || []
        })
    }

    getFoodsBySys = (data = {}) => {
        const _this = this;
        const { env } = _this.state;

        _this.setState({
            loading: true
        })
        wx.cloud.callFunction({
            name: 'foodSys',
            data: { ...data, action: 'getFoodsBySys', env },
            complete: (res = {}) => {
                const result = res.result && res.result.list || [];
                const sysList = result.filter(item => {
                    return item.containFoods.length
                }).map(item => {
                    return { ...item, title: item.name }
                })
                _this.setState({
                    sysList,
                    currentFoodList: sysList[0] && sysList[0].containFoods || [],
                    loading: false
                })
            }
        })
    }

    componentDidMount() {
        this.getFoodsBySys()
    }

    render() {
        const { current, loading, sysList = [], currentFoodList = [] } = this.state;
        return <View className='at-row' style={{ position: 'relative' }}>
            <AtMessage />
            {
                loading ? <AtActivityIndicator content='加载中...' mode='center'></AtActivityIndicator> : null
            }
            <AtToast isOpened text="{text}" icon="{icon}"></AtToast>

            <AtTabs
                current={current}
                height='95vh'
                tabDirection='vertical'
                tabList={sysList}
                onClick={this.onToggleCurrent.bind(this)}>
                {
                    sysList.map((item, index) => {
                        return <AtTabsPane key={item._id} tabDirection='vertical' current={current} index={index}>
                            {
                                currentFoodList.length ? currentFoodList.map(foodItem => {
                                    return <View className='food_item_wrapper' key={foodItem._id} onClick={() => { }}>
                                        <View style={{ display: 'flex' }}>
                                            <AtAvatar size='large' image={foodItem.pics.length && foodItem.pics[0].url || ''} ></AtAvatar>
                                            <View className='food_item'>
                                                <View className='food_name'>{foodItem.name}</View>
                                                <View className='food_desc'>{foodItem.desc}</View>
                                            </View>
                                        </View>
                                        <View className='food_add_icon'>
                                            <Image src='https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/common_icon/add.png' />
                                        </View>
                                    </View>
                                }) : <View style='font-size:18px;text-align:center;height:200px;'>还没有菜品嗷</View>
                            }
                        </AtTabsPane>
                    })
                }
            </AtTabs>
        </View>
    }
}