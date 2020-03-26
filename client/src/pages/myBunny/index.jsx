import "./index.less";

import { View } from "@tarojs/components";
import { Component } from "@tarojs/taro";

export default class MyBunny extends Component {

    componentWillMount() { }

    componentDidMount() {
    }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    config = {
        navigationBarTitleText: '我爱兔兔'
    }

    navigateTo = (url) => {
        Taro.navigateTo({
            url
        })
    }

    render() {
        return (
            <View className='myBunny'>

            </View>
        )
    }
}
