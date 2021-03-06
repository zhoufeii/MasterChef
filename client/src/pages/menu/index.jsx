import "./index.less";

import { View } from "@tarojs/components";
import { Component } from "@tarojs/taro";

import CartAndPay from "../../components/cartAndPay";
import Foods from "../../components/foods";
import Loading from "../../components/loading";
import { getGlobalData } from "../../utils/globalData";

export default class DetailBanner extends Component {

  constructor(props) {
    super(props);
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
    // if (animating) return;
    const { _id = '' } = item;
    const currentFood = currentFoodList.filter(item => item._id === _id)[0];
    const hasOrder = orderList.some(item => item._id === _id)
    // const currentOrderFood = orderList.filter(item => item._id === _id)
    // console.log(currentOrderFood)
    // if (currentOrderFood && currentOrderFood[0] && currentOrderFood[0].count > 2) {
    //   showToast('好吃也不能点太多啦~');
    //   return;
    // }
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
      // ballStyle: {
      //   top: `${y}px`,
      //   left: `${x}px`,
      //   transition: `left 0s, top 0s`
      // },
      orderList,
      count: orderList.filter(item => item.count).reduce((x, y) => { return x + y.count }, 0)
      // animating: true,
    }
      // , () => {
      // setTimeout(() => {
      //   this.setState({
      //     ballStyle: {
      //       width: '20px',
      //       height: '20px',
      //       top: `92vh`,
      //       left: `60px`,
      //       transition: `left .4s linear, top .4s ease-in`
      //     },
      //     count: orderList.filter(item => item.count).reduce((x, y) => { return x + y.count }, 0)
      //   })
      // }, 20)}
    )

    // setTimeout(() => {
    //   this.setState({
    //     animating: false,
    //   })
    // }, 500)
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

    // _this.setState({
    //   loading: true
    // })
    Taro.cloud.callFunction({
      name: 'foodSys',
      data: { ...data, action: 'getFoodsBySys', env },
      complete: (res = {}) => {
        const result = res.result && res.result.list || [];
        console.log(result)
        const sysList = result.filter(item => {
          return item.containFoods.length
        }).map(item => {
          return { ...item, title: item.name }
        })
        _this.setState({
          sysList,
          currentFoodList: sysList[0] && sysList[0].containFoods || [],
          loading: false,
          initialCompleted: true
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

  config = {
    navigationBarTitleText: '熊家菜单'
  }

  render() {
    const { current = 0, count = 0, loading = true, initialCompleted = false, sysList = [], currentFoodList = [], orderList = [], ballStyle = {}, } = this.state;
    const scrollTop = 0
    const Threshold = 20

    return <View className='menu_wrapper' >
      {/* <Ball ballStyle={ballStyle} /> */}
      <Loading loading={loading} initialCompleted={initialCompleted} />

      <View id='menu_inner' className='menu_inner'>
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
          {
            sysList.map((item, index) => {
              return <View className={current === index ? 'sys_item active' : 'sys_item'} key={item._id} onClick={this.onToggleCurrent.bind(this, index)}>
                <View className={current === index ? 'sys_item_name active' : 'sys_item_name'}>{item.name}</View>
              </View>
            })
          }
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
          <Foods
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
