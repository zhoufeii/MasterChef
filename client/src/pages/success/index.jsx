import "./index.less";

import { View } from "@tarojs/components";
import { Component } from "@tarojs/taro";

export default class Index extends Component {

    componentWillMount() { }

    componentDidMount() {
    }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    config = {
        navigationBarTitleText: '点菜成功！'
    }

    navigateTo = (url) => {
        Taro.navigateTo({
            url
        })
    }

    render() {
        return (
            <View className='success'>
                成功！
            </View>
        )
    }
}
