import "./index.less";

import {
  AtActivityIndicator,
  AtAvatar,
  AtMessage,
  AtTabs,
  AtTabsPane
} from "taro-ui";

import Taro, { Component } from "@tarojs/taro";

export default class DetailBanner extends Component {

    constructor() {
        super();
        this.state = {
            current: 0,
            loading: true,
            sysList: [],
            currentFoodList: []
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
        const currentSysId = sysList[current]._id
        this.setState({
            current
        }, this.getFoodsBySys.bind(this, { sysId: currentSysId }))
    }

    getFoodSys = (data = {}) => {
        const _this = this;
        _this.setState({
            loading: true
        })
        wx.cloud.callFunction({
            name: 'foodSys',
            data: { ...data, action: 'getFoodSys' },
            complete: (res = {}) => {
                const result = res.result && res.result.data || [];
                _this.setState({
                    sysList: result.map(item => {
                        return { ...item, title: item.name }
                    }),
                    loading: false
                }, () => {
                    _this.getFoodsBySys(result[0] && result[0].sysId || '')
                })
            }
        })
    }

    getFoodsBySys = (data = {}) => {
        const _this = this;
        _this.setState({
            loading: true
        })
        wx.cloud.callFunction({
            name: 'foodSys',
            data: { ...data, action: 'getFoodsBySys' },
            complete: (res = {}) => {
                console.log(res)
                const result = res.result && res.result.data || [];
                console.log('callFunction test result: ', result)
                _this.setState({
                    // currentFoodList: result,
                    loading: false
                })
            }
        })
    }

    componentDidMount() {
        this.getFoodSys()
    }

    render() {
        const { current, loading, sysList = [], currentFoodList = [] } = this.state;
        return <View className='at-row' style={{ position: 'relative' }}>
            <AtMessage />
            {
                loading ? <AtActivityIndicator content='加载中...' mode='center'></AtActivityIndicator> : null
            }
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
                                    return <View className='food_item' key={foodItem._id} >
                                        <AtAvatar size='large' image={foodItem.avatar || ''} ></AtAvatar>
                                        <View className='food_info'>
                                            <View className='food_name'>{foodItem.name}</View>
                                            <View className='food_desc'>{foodItem.desc}</View>
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