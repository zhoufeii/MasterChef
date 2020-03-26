import "./index.less";

import { View } from "@tarojs/components";
import { Component } from "@tarojs/taro";

export default class FoodDetail extends Component {

    componentWillMount() { }

    componentDidMount() {
    }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    config = {
        navigationBarTitleText: '菜品详情'
    }

    navigateTo = (url) => {
        Taro.navigateTo({
            url
        })
    }

    render() {
        return (
            <View className='foodDetail'>

            </View>
        )
    }
}
