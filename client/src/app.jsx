import "./app.less";
import "taro-ui/dist/style/index.scss";

import Taro, { Component } from "@tarojs/taro";

import Index from "./pages/index";

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  componentDidMount() {
    console.log(process.env.TARO_ENV)
    console.log(process.env.NODE_ENV)
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init({
        env: process.env.NODE_ENV,
        traceUser: true
      })
    }

    // wx.cloud.callFunction({
    //   name: 'initContext',
    //   data: {},
    //   success: res => {
    //     // wx.showToast({
    //     //   title: '调用成功',
    //     // })
    //     console.log('=======res======')
    //     console.log(res)
    //   },
    //   fail: err => {
    //     // wx.showToast({
    //     //   icon: 'none',
    //     //   title: '调用失败',
    //     // })
    //     console.error('[云函数] [sum] 调用失败：', err)
    //   }
    // })
  }

  componentDidShow() { }

  componentDidHide() { }

  componentDidCatchError() { }

  config = {
    pages: [
      'pages/index/index',
      'pages/dishList/index',
      'pages/dishInsert/index',

    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
