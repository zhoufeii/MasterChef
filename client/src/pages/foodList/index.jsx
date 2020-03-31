import "./index.less";

import { AtSearchBar } from "taro-ui";

import {
  Image,
  View
} from "@tarojs/components";
import { Component } from "@tarojs/taro";

import Avatar from "../../components/avatar";
import Loading from "../../components/loading";
import { getGlobalData } from "../../utils/globalData";
import { showToast } from "../../utils/index";

export default class Index extends Component {

    constructor() {
        super();
        this.state = {
            env: getGlobalData('env') || '',
            USER_TYPE: getGlobalData('USER_TYPE') || '',
            RABBIT: getGlobalData('RABBIT') || '',
            name: '',
            list: [],
            pageNo: 0,
            pageSize: 10,
            noMore: false,
            loading: true,
            initialCompleted: false
        }
    }

    componentWillMount() { }

    componentDidMount() {
        this.handleGetFoodList()
    }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    config = {
        navigationBarTitleText: '我的冰箱'
    }

    navigateTo = (url) => {
        const { USER_TYPE, RABBIT } = this.state;
        if (USER_TYPE <= RABBIT) {
            Taro.navigateTo({
                url
            })
        }
    }

    handleGetFoodList = () => {
        const { env, name = '', pageNo, pageSize, list = [] } = this.state;
        Taro.cloud.callFunction({
            name: 'foods',
            data: { action: 'getFoods', name, pageNo, pageSize, env },
        }).then(res => {
            if (!res.result.data.length) {
                this.setState({
                    loading: false,
                    list: [],
                    noMore: true,
                    initialCompleted: true
                })
            } else {
                this.setState({
                    loading: false,
                    list: [...list, ...res.result.data],
                    noMore: res.result.data && res.result.data.length < pageSize,
                    initialCompleted: true
                })
            }
        }).catch(err => {
            showToast('获取菜品失败，请联系大熊！')
        })
    }

    onNameChange = (name) => {
        this.setState({
            name: name.trim()
        })
    }

    onReachBottom() {
        const { pageNo, noMore = false } = this.state;
        if (!noMore) {
            this.setState({
                pageNo: +pageNo + 1,
                loading: true
            }, this.handleGetFoodList)
        }
    }

    render() {
        const { list = [], loading = true, name = '', initialCompleted = false, USER_TYPE, RABBIT } = this.state;
        return (
            <View className='foodList'>
                <Loading loading={loading} initialCompleted={false} />
                <View className='foodList_search_wrapper'>
                    <AtSearchBar
                        showActionButton={true}
                        actionName='大熊搜索'
                        placeholder='请输入菜品名称'
                        value={name}
                        onChange={this.onNameChange.bind(this)}
                        onActionClick={() => {
                            this.setState({
                                pageNo: 0,
                                list: [],
                                loading: true,
                                initialCompleted: false
                            }, this.handleGetFoodList.bind(this))
                        }}
                    />
                </View>
                {
                    initialCompleted && list.length ? <View className='foods_wrapper'>
                        {
                            list.map(item => {
                                return <View key={item._id} className='food_item_wrapper' onClick={this.navigateTo.bind(this, `/pages/edit/index?type=dish&id=${item._id}`)}>
                                    <View className='food_item_top'>
                                        <Avatar size='large' text={item.name} pic={item.pics && item.pics.length && item.pics[0] && item.pics[0].url} />
                                        <View className='food_item_info_wrapper'>
                                            <View className='food_item_info'>
                                                <View className='item_name'>{item.name}</View>
                                                {
                                                    item.star ? <View className='item_count'>
                                                        <View className='star'>
                                                            <Image src='https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/common_icon/star.png' />
                                                        </View>
                                                        <View> {`x ${item.star}`} </View>

                                                    </View> : null
                                                }
                                            </View>
                                            <View className='right_arrow'>
                                                <Image src='https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/common_icon/right_arrow.png' />
                                            </View>
                                        </View>
                                    </View>
                                    <View className='food_item_bottom'>
                                        <View>大熊说：{item.desc}</View>
                                    </View>
                                </View>
                            })
                        }
                    </View> : null
                }
                {
                    initialCompleted && !list.length ? <View className='foods_wrapper'>
                        <View className='empty_image'>
                            <Image src='https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/common_icon/empty.png' />
                        </View>
                        <View className='empty_title'>{name && name.trim() ? '这个菜还没有被收录到熊家厨房' : '冰箱里什么也没有'}</View>
                        {
                            USER_TYPE <= RABBIT ? <View className='empty_text_wrapper' onClick={this.navigateTo.bind(this, '/pages/add/index?type=dish')}>
                                <View className='empty_text'>马上添加</View>
                                <View className='right_arrow'>
                                    <Image src='https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/common_icon/right_arrow.png' />
                                </View>
                            </View> : null
                        }
                    </View> : null
                }
                {
                    noMore && list.length ? <View className='bottom_line_wrapper'>
                        <View className='bottom_line'></View>
                        <View className='bottom_line_text'>我也是有底线的</View>
                        <View className='bottom_line'></View>
                    </View> : null
                }
            </View>
        )
    }
}
