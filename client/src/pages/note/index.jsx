import "./index.less";

import {
  AtButton,
  AtTextarea
} from "taro-ui";

import { View } from "@tarojs/components";
import { Component } from "@tarojs/taro";

export default class Index extends Component {

    constructor() {
        super();
        this.state = {
            note: decodeURI(this.$router.params.note) || ''
        }
    }

    componentWillMount() { }

    componentDidMount() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    config = {
        navigationBarTitleText: '添加备注'
    }

    navigateTo = (url) => {
        Taro.navigateTo({
            url
        })
    }

    backTo = (delta = 1) => {
        const { note = '' } = this.state;
        const pages = getCurrentPages();
        const ConfirmComponent = pages[getCurrentPages().length - 2]
        console.log(ConfirmComponent.$component.setState)
        ConfirmComponent.$component.setState({
            note
        }, () => {
            Taro.navigateBack({
                delta
            })
        })
    }

    onNoteChange = (ev) => {
        const note = ev.target.value || ''
        this.setState({
            note
        })
    }
    render() {
        const { note = '', } = this.state;
        return (
            <View className='note'>
                <AtTextarea
                    height={250}
                    value={note}
                    onChange={this.onNoteChange}
                    maxLength={200}
                    placeholder='请输入订单备注，例如免葱、免辣，或者夸夸大熊'
                />
                <View className='btn_wrapper'>
                    <AtButton full={false} type='primary' onClick={this.backTo}>保存备注</AtButton>
                </View>
            </View>
        )
    }
}
