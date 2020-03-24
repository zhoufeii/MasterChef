import "./index.less";

import {
  AtButton,
  AtTextarea
} from "taro-ui";

import { View } from "@tarojs/components";
import { Component } from "@tarojs/taro";

import Loading from "../../components/loading";
import { getGlobalData } from "../../utils/globalData";
import { showToast } from "../../utils/index";

export default class Index extends Component {

    constructor() {
        super();
        this.state = {
            loading: true,
            env: getGlobalData('env') || '',
            note: decodeURI(this.$router.params.note) || ''
        }
    }

    componentWillMount() { }

    componentDidMount() {
        const _this = this;
        const { env } = _this.state;
        Taro.cloud.callFunction({
            name: 'notes',
            data: { action: 'getRecentNote', env },
        }).then((res = {}) => {
            console.log(res.result)
            _this.setState({
                loading: false,
                recentNotes: res.result || []
            })
        }).catch(err => {
            showToast('获取最近备注失败，请联系大熊！')
        })
    }

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

    selectNote = (selectNote) => {
        let { note } = this.state;
        this.setState({
            note: note.trim() ? `${note}，${selectNote}` : selectNote
        })
    }

    render() {
        const { note = '', loading = true, recentNotes = [] } = this.state;
        return (
            <View className='note'>
                <Loading loading={loading} initialCompleted={false} />
                <AtTextarea
                    height={250}
                    value={note}
                    onChange={this.onNoteChange}
                    maxLength={200}
                    placeholder='请输入订单备注，例如免葱、免辣，或者夸夸大熊'
                />
                <View className='recentNotes_wrapper'>
                    {
                        recentNotes.length && recentNotes.map((item, index) => <View key={`note_${index}`} className='recentNotes_item' onClick={this.selectNote.bind(this, item)}>{item || ''}</View>)
                    }
                </View>
                <View className='btn_wrapper'>
                    <AtButton full={false} type='primary' onClick={this.backTo}>保存备注</AtButton>
                </View>
            </View>
        )
    }
}
