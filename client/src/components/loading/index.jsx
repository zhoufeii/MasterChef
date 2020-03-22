import "./index.less";

import { AtActivityIndicator } from "taro-ui";

import { View } from "@tarojs/components";
import { Component } from "@tarojs/taro";

export default class Loading extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { loading = true, initialCompleted = false } = this.props;
        return <View>
            {
                !initialCompleted && loading ? <View className='loading_wrapper'>
                    <AtActivityIndicator content='加载中...'></AtActivityIndicator>
                </View> : null
            }
        </View>
    }
}

