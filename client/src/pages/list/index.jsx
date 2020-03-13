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

  config = {
    navigationBarTitleText: '列表'
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
