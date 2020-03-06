import "./index.less";

import {
  AtActivityIndicator,
  AtMessage,
  AtTabs,
  AtTabsPane
} from "taro-ui";

import Taro, { Component } from "@tarojs/taro";

import {
  getFoodBySys,
  getFoodSys
} from "../../service/index";

export default class DetailBanner extends Component {

    constructor() {
        super();
        this.state = {
            current: 0,
            // loading: true,
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

    onToggleCurrent = (currentIndex) => {
        const { sysList = [] } = this.state;
        const currentSysId = sysList[currentIndex]._id
        getFoodBySys({
            sysId: currentSysId
        }, res => {
            this.setState({
                currentFoodList: res,
                current: currentIndex
            })
        }, error => {
            console.log(error)
        })
    }

    componentDidMount() {
        getFoodSys(null, (res) => {
            this.setState({
                sysList: res.map(item => {
                    return { ...item, title: item.name }
                }),
            }, () => {
                getFoodBySys({
                    sysId: this.state.sysList[0]
                }, res => {
                    this.setState({
                        currentFoodList: res,
                        // loading: false
                    })
                }, error => {
                    console.log(error)
                })
            })
        }, (error) => {
            console.log(error)
        })
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
                // scroll
                height='95vh'
                tabDirection='vertical'
                tabList={sysList}
                onClick={this.onToggleCurrent.bind(this)}>
                {
                    sysList.map((item, index) => {
                        return <AtTabsPane key={item._id} tabDirection='vertical' current={current} index={index}>
                            {
                                currentFoodList.length ? currentFoodList.map(foodItem => {
                                    return <View key={foodItem._id} style='font-size:18px;text-align:center;height:200px;'>{foodItem.name || '没显示'}</View>
                                }) : <View style='font-size:18px;text-align:center;height:200px;'>还没有菜品嗷</View>
                            }
                        </AtTabsPane>
                    })
                }
            </AtTabs>
        </View>
    }
}