import "./index.less";

import { View } from "@tarojs/components";
import { Component } from "@tarojs/taro";

import Banner from "../../components/banner";
import Menu from "../../components/menu";

export default class List extends Component {

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  onPageScroll(ev) {
    console.log(ev)
    Taro.createSelectorQuery().selectViewport().scrollOffset().exec((res) => {
      console.log(res[0])
    })
  }

  config = {
    navigationBarTitleText: '熊家菜单'
  }

  render() {
    return (
      <View>
        <Banner />
        <Menu />
      </View>
    )
  }
}
