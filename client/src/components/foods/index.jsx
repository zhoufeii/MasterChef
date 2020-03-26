import "./index.less";

import {
  Text,
  View
} from "@tarojs/components";
import { Component } from "@tarojs/taro";

import Avatar from "../avatar/index";

export default class Foods extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { list = [], orderList = [], onFoodItemAdd = () => { }, onFoodItemMinus = () => { } } = this.props;
        return <View>
            {
                list.map(item => {
                    const itemArray = orderList.filter(orderItem => orderItem._id === item._id);
                    const count = itemArray.length && itemArray[0].count
                    return <View className='food_item_wrapper' key={item._id} >
                        <View style={{ display: 'flex' }}>
                            <Avatar pic={item.pics.length && item.pics[0].url} text={item.name} />
                            <View className='food_item'>
                                <View className='food_name'>{item.name}</View>
                                <View className='food_desc'>{item.desc}</View>
                            </View>
                        </View>
                        <View className='food_num_icon_wrapper' >
                            {
                                count ? <Image onClick={onFoodItemMinus.bind(this, item)} className='food_count_icon' src='https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/common_icon/minus.png' /> : null
                            }

                            {
                                count ? <Text>{count}</Text> : null
                            }

                            <Image onClick={onFoodItemAdd.bind(this, item)} className='food_count_icon' src='https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/common_icon/add.png' />
                        </View>
                    </View>
                })
            }
        </View>
    }
}