import "./index.less";

import { View } from "@tarojs/components";
import { Component } from "@tarojs/taro";

import Avatar from "../avatar";

export default class DetailBanner extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    componentDidMount() {

    }

    render() {
        const { userInfo = {} } = this.props;
        console.log(userInfo)
        return <View className='banner_wrapper'>
            <Image className='banner_background' src='https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/common_icon/bear_cut.jpg' />
            <View className='banner'>
                <View className='banner_header'>
                    <View className='banner_name'>熊家厨房</View>
                    <Avatar pic={userInfo.avatarUrl} text={userInfo.nickName} />
                </View>
                <View className='banner_tips'>本店只接受可爱小兔点菜</View>
                <View className='banner_desc'>本店宗旨：熊家厨房，只做兔子爱吃的菜！</View>
            </View>
        </View>
    }
}