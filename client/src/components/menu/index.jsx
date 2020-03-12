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
        const { currentFoodList = [], animating = false } = this.state;
        if (animating) return;
        const { _id = '' } = item;
        // const hasOrder = currentFoodList.some(item => item._id === _id && item.count)
        // if (hasOrder) {
        //     Taro.showToast({
        //         title: '已经点过这个菜啦~',
        //         icon: ''
        //     })
        //     return;
        // } else {
        this.setState({
            currentFoodList: currentFoodList.map(item => {
                if (item._id === _id) {
                    return { ...item, count: item.count ? item.count + 1 : 1 }
                } else {
                    return item
                }
            }),
            ballStyle: {
                top: `${y}px`,
                left: `${x}px`,
                transition: `left 0s, top 0s`
            },
            animating: true
        })

        setTimeout(() => {
            this.setState({
                ballStyle: {
                    top: `92vh`,
                    left: `60px`,
                    transition: `left .4s linear, top .4s ease-in`
                }
            })
        }, 20)

        setTimeout(() => {
            this.setState({
                animating: false,
            })
        }, 500)
        // }
    }

    onFoodItemMinus = (item = {}) => {
        const { currentFoodList = [] } = this.state;
        const { _id = '' } = item;
        this.setState({
            currentFoodList: currentFoodList.map(item => {
                if (item._id === _id) {
                    return { ...item, count: item.count - 1 }
                } else {
                    return item
                }
            }),
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

    // or 使用箭头函数
    // onScrollToUpper = () => {}

    onScroll = (e) => {
        console.log(e.detail)
    }

    render() {
        const { current = 0, loading, sysList = [], currentFoodList = [], ballStyle = {}, } = this.state;
        console.log(currentFoodList)
        const scrollTop = 0
        const Threshold = 20

        return <View>
            <Ball ballStyle={ballStyle} />
            {
                loading ? <AtActivityIndicator content='加载中...' mode='center'></AtActivityIndicator> : null
            }
            <AtToast isOpened text="{text}" icon="{icon}"></AtToast>

            {/* <AtTabs
                current={current}
                height='100vh'
                tabDirection='vertical'
                tabList={sysList}
                onClick={this.onToggleCurrent.bind(this)}>
                {
                    sysList.map((item, index) => {
                        return <AtTabsPane key={item._id} tabDirection='vertical' current={current} index={index}>
                            <FoodList list={currentFoodList} onFoodItemAdd={this.onFoodItemAdd} onFoodItemMinus={this.onFoodItemMinus} />
                        </AtTabsPane>
                    })
                }
            </AtTabs> */}
            {/* <Swiper
                vertical
                circular
                indicatorDots={false}
                easingFunction='linear'
                style={{ height: '300px' }}
            >
                <SwiperItem>
                    <View style={{ background: "red", height: '300px' }} className='demo-text-1'>1</View>
                </SwiperItem>
                <SwiperItem>
                    <View style={{ background: "green", height: '300px' }} className='demo-text-2'>2</View>
                </SwiperItem>
                <SwiperItem>
                    <View style={{ background: "blue", height: '300px' }} className='demo-text-3'>3</View>
                </SwiperItem>
            </Swiper> */}
            {/* <FoodList list={currentFoodList} onFoodItemAdd={this.onFoodItemAdd} onFoodItemMinus={this.onFoodItemMinus} /> */}
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
                    <View style={{ borderRight: '2px solid #f0f0f0' }}>
                        {
                            sysList.map((item, index) => {
                                return <View className='sys_item' key={item._id} onClick={this.onToggleCurrent.bind(this, index)}>
                                    <View className='sys_item_name'>{item.name}</View>
                                </View>
                            })
                        }
                        <View className='active_item' style={{ transform: `translateY(${current * 42 + 8}px)`, transition: `.2s linear` }}></View>
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
                    <FoodList list={currentFoodList} onFoodItemAdd={this.onFoodItemAdd} onFoodItemMinus={this.onFoodItemMinus} />
                </ScrollView>
            </View>

            <CartAndPay count={0} />
        </View>
    }
}