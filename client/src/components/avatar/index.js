import "./index.less";

import { AtAvatar } from "taro-ui";

import { Component } from "@tarojs/taro";

export default class Avatar extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { pic = '', text = '' } = this.props;
        return pic ? <AtAvatar size='large' image={pic} ></AtAvatar> : <AtAvatar size='large' text={text} ></AtAvatar>
    }
}