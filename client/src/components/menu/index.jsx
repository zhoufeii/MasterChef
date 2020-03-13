import "./index.less";

import { AtActivityIndicator } from "taro-ui";

import { View } from "@tarojs/components";
import { Component } from "@tarojs/taro";

import { getGlobalData } from "../../utils/globalData";
import Ball from "../ball/index";
import CartAndPay from "../cartAndPay/index";
import FoodList from "../foodList/index";

export default class DetailBanner extends Component {

    constructor() {
        super();
        this.state = {
            current: 0,
            loading: true,
            sysList: [],
            currentFoodList: [],
            env: getGlobalData('env') || '',
            orderList: [],
            ballStyle: {}
        }
    }

    onToggleCurrent = (current) => {
        const { sysList = [] } = this.state;
        this.setState({
            current,
            currentFoodList: sysList[current] && sysList[current].containFoods || []
        })
    }

    onFoodItemAdd = (item = {}, event) => {
        const { x, y } = event.detail;
        const { currentFoodList = [], animating = false, } = this.state;
        let { orderList = [] } = this.state;
        if (animating) return;
        const { _id = '' } = item;
        const currentFood = currentFoodList.filter(item => item._id === _id)[0];
        const hasOrder = orderList.some(item => item._id === _id)
        if (hasOrder) {
            // 点过这个菜了
            orderList = orderList.map(item => {
                if (item._id === _id) {
                    return { ...item, count: item.count + 1 }
                } else {
                    return item
                }
            })
        } else {
            orderList = [...orderList, { ...currentFood, count: 1 }]
        }
        this.setState({
            ballStyle: {
                top: `${y}px`,
                left: `${x}px`,
                transition: `left 0s, top 0s`
            },
            orderList,
            animating: true,
        }, () => {
            setTimeout(() => {
                this.setState({
                    ballStyle: {
                        width: '20px',
                        height: '20px',
                        top: `92vh`,
                        left: `60px`,
                        transition: `left .4s linear, top .4s ease-in`
                    },
                    count: orderList.filter(item => item.count).reduce((x, y) => { return x + y.count }, 0)
                })
            }, 20)
        })

        setTimeout(() => {
            this.setState({
                animating: false,
            })
        }, 500)
        // }
    }

    onFoodItemMinus = (item = {}) => {
        let { orderList = [] } = this.state;
        const { _id = '' } = item;
        const orderedItem = orderList.filter(item => item._id === _id)[0];
        if (orderedItem.count > 1) {
            orderedItem.count--;
        } else {
            orderedItem.count = 0
        }
        orderList = orderList.filter(item => {
            return item.count
        })
        this.setState({
            orderList
        }, () => {
            const { orderList = [] } = this.state;
            this.setState({
                count: orderList.filter(item => item.count).reduce((x, y) => { return x + y.count }, 0)
            })
        })
    }

    onClear = () => {
        this.setState({
            orderList: [],
            count: 0
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

    onScrollToLower = (e) => {
        console.log(e)
    }

    render() {
        const { current = 0, count = 0, loading = false, sysList = [], currentFoodList = [], orderList = [], ballStyle = {}, } = this.state;
        const scrollTop = 0
        const Threshold = 20

        return <View>
            <Ball ballStyle={ballStyle} />
            {
                loading ? <AtActivityIndicator content='加载中...' mode='center'></AtActivityIndicator> : null
            }

            <View style={{ display: 'flex' }}>
                <ScrollView
                    className='sys_wrapper'
                    scrollY
                    scrollAnchoring={true}
                    scrollWithAnimation={true}
                    scrollTop={scrollTop}
                    lowerThreshold={Threshold}
                    upperThreshold={Threshold}
                    onScrollToLower={this.onScrollToLower.bind(this)} // 使用箭头函数的时候 可以这样写 `onScrollToUpper={this.onScrollToUpper}`
                >
                    <View>
                        {
                            sysList.map((item, index) => {
                                return <View className='sys_item' style={current === index ? { background: '#fff' } : { background: '#f0f0f0' }} key={item._id} onClick={this.onToggleCurrent.bind(this, index)}>
                                    <View className='sys_item_name' style={current === index ? { color: '#6190E8', fontWeight: 'bold' } : { color: '#000', fontWeight: '400' }}>{item.name}</View>
                                </View>
                            })
                        }
                    </View>
                </ScrollView>
                <ScrollView
                    className='foods_wrapper'
                    scrollY
                    scrollWithAnimation={true}
                    scrollTop={scrollTop}
                    lowerThreshold={Threshold}
                    upperThreshold={Threshold}
                    onScrollToLower={this.onScrollToLower.bind(this)} // 使用箭头函数的时候 可以这样写 `onScrollToUpper={this.onScrollToUpper}`
                >
                    <FoodList
                        list={currentFoodList}
                        orderList={orderList}
                        onFoodItemAdd={this.onFoodItemAdd}
                        onFoodItemMinus={this.onFoodItemMinus}
                    />
                </ScrollView>
            </View>
            <CartAndPay
                count={count}
                orderList={orderList}
                onFoodItemAdd={this.onFoodItemAdd}
                onFoodItemMinus={this.onFoodItemMinus}
                onClear={this.onClear}
            />
        </View>
    }
}