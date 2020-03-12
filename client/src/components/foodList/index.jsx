import "./index.less";

import { AtAvatar } from "taro-ui";

import {
  Text,
  View
} from "@tarojs/components";
import { Component } from "@tarojs/taro";

export default class FoodList extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { list = [], onFoodItemAdd = () => { }, onFoodItemMinus = () => { } } = this.props;
        return <View>
            {
                list.map(item => {
                    return <View className='food_item_wrapper' key={item._id} >
                        <View style={{ display: 'flex' }}>
                            <AtAvatar size='large' image={item.pics.length && item.pics[0].url || ''} ></AtAvatar>
                            <View className='food_item'>
                                <View className='food_name'>{item.name}</View>
                                <View className='food_desc'>{item.desc}</View>
                            </View>
                        </View>
                        <View className='food_num_icon_wrapper' >
                            {
                                item.count ? <Image onClick={onFoodItemMinus.bind(this, item)} className='food_count_icon' src='https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/common_icon/minus.png' /> : null
                            }

                            {
                                item.count ? <Text>{item.count}</Text> : null
                            }

                            <Image onClick={onFoodItemAdd.bind(this, item)} className='food_count_icon' src='https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/common_icon/add.png' />
                        </View>
                    </View>
                })
            }
        </View>
    }
}