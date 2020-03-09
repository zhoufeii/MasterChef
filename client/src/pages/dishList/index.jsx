import "./index.less";

import { View } from "@tarojs/components";
import { Component } from "@tarojs/taro";

import DetailBanner from "../../components/detailBanner";
import DetailList from "../../components/DetailList";

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
        <DetailBanner />
        <DetailList />
      </View>
    )
  }
}
