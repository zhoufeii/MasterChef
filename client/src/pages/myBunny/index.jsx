import "./index.less";

import moment from "moment";
import {
  AtButton,
  AtCalendar
} from "taro-ui";

import { View } from "@tarojs/components";
import { Component } from "@tarojs/taro";

import Loading from "../../components/loading";

export default class MyBunny extends Component {

    constructor() {
        super();
        this.state = {
            showDate: moment(),
            loading: true
        }
    }

    componentWillMount() { }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                loading: false,
                initialCompleted: true
            })
        }, 500);
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

    setDate = (showDate) => {
        this.setState({
            loading: true
        }, () => {
            setTimeout(() => {
                this.setState({
                    showDate,
                    loading: false
                })
            }, 200)
        })

    }

    render() {
        const { showDate = Date.now(), loading = true, initialCompleted = false } = this.state;
        return (
            <View className='myBunny'>
                <Loading loading={loading} initialCompleted={false} />
                {
                    initialCompleted ? <View>
                        <AtCalendar currentDate={showDate} hideArrow={true} />

                        <View className='btn_wrapper'>
                            <AtButton className='btn rabbit' type='primary' onClick={this.setDate.bind(this, '2020/11/17')}>看小兔的生日</AtButton>
                            <AtButton className='btn bear' type='primary' onClick={this.setDate.bind(this, '2020/12/09')}>看大熊的生日</AtButton>
                            <AtButton className='btn' type='secondary' onClick={this.setDate.bind(this, moment())}>回到今天</AtButton>
                        </View>
                    </View> : null
                }
            </View>
        )
    }
}
