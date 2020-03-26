import "./app.less";
import "taro-ui/dist/style/index.scss";

import Taro, { Component } from "@tarojs/taro";

import Index from "./pages/index";
import { setGlobalData } from "./utils/globalData";

class App extends Component {

  componentDidMount() {
    const env = 'dev-uel3w' || 'online-p5ijz';
    if (process.env.TARO_ENV === 'weapp') {
      console.log(`process.env.NODE_ENV: ${env}`)
      Taro.cloud.init({
        env,
        traceUser: true
      })
    }
    setGlobalData("env", env)  //全局变量  online-p5ijz
  }

  componentDidShow() { }

  componentDidHide() { }

  componentDidCatchError() { }

  config = {
    pages: [
      'pages/index/index',
      'pages/menu/index',
      'pages/add/index',
      'pages/login/index',
      'pages/confirm/index',
      'pages/note/index',
      'pages/success/index',
      'pages/orderDetail/index',
      'pages/orderList/index',
      'pages/foodList/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black',
      onReachBottomDistance: 300
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
