import "./index.less";

import { AtAvatar } from "taro-ui";

import { Component } from "@tarojs/taro";

export default class Avatar extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { pic = '', text = '', size = 'large' } = this.props;
        return pic ? <AtAvatar size={size} image={pic} ></AtAvatar> : <AtAvatar size={size} text={text} ></AtAvatar>
    }
}