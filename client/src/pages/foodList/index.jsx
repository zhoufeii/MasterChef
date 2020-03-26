import "./index.less";

import { AtSearchBar } from "taro-ui";

import { View } from "@tarojs/components";
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
            searchContent: '',
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
        Taro.navigateTo({
            url
        })
    }

    handleGetFoodList = () => {
        const { env, searchContent = '', pageNo, pageSize, list = [] } = this.state;
        Taro.cloud.callFunction({
            name: 'foods',
            data: { action: 'getFoods', pageNo, pageSize, env },
        }).then(res => {
            console.log(res)
            this.setState({
                loading: false,
                list: list.concat(res.result.data || []),
                noMore: res.result.data && res.result.data.length < pageSize,
                initialCompleted: true
            })
        }).catch(err => {
            showToast('获取菜品失败，请联系大熊！')
        })
    }

    onSearchContentChange = (searchContent) => {
        this.setState({
            searchContent
        })
    }

    onReachBottom() {
        console.log("上拉触底事件")
        const { pageNo, noMore = false } = this.state;
        if (!noMore) {
            this.setState({
                pageNo: +pageNo + 1,
                loading: true
            }, this.handleGetFoodList)
        }
    }

    render() {
        const { list = [], loading = true, searchContent = '', initialCompleted = false } = this.state;
        return (
            <View className='foodList'>
                <Loading loading={loading} initialCompleted={false} />
                <View className='foodList_search_wrapper'>
                    <AtSearchBar
                        placeholder='请输入菜品名称'
                        value={searchContent}
                        onChange={this.onSearchContentChange.bind(this)}
                    />
                </View>
                {
                    initialCompleted && list.length ? <View className='foods_wrapper'>
                        {
                            list.map(item => {
                                return <View key={item._id} className='food_item_wrapper'>
                                    <View className='food_item_top'>
                                        <Avatar size='large' text={item.name} pic={item.pics && item.pics.length && item.pics[0] && item.pics[0].url} />
                                        <View className='food_item_info_wrapper'>
                                            <View className='food_item_info'>
                                                <View className='item_name'>{item.name}</View>
                                                <View className='item_count'>下单次数：0</View>
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
