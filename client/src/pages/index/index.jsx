import "./index.less";

import {
  AtAvatar,
  AtGrid
} from "taro-ui";

import {
  Button,
  Text,
  View
} from "@tarojs/components";
import { Component } from "@tarojs/taro";

import { getGlobalData } from "../../utils/globalData";

export default class Index extends Component {
  constructor() {
    super();
    this.state = {
      hasAuth: false,
      userInfo: {},
      env: getGlobalData('env') || ''
    }
  }

  componentWillMount() { }

  componentDidMount() {
    const _this = this;
    // Taro.getSetting({
    //   success(res) {
    //     console.log(res.authSetting)
    //     if (!res.authSetting['scope.userInfo']) {
    //       Taro.authorize({
    //         scope: 'scope.userInfo',
    //         success(res) {
    //           console.log(res)
    //         },
    //         fail(err) {
    //           console.log(err)
    //         }
    //       })
    //     } else {
    //       Taro.getUserInfo({
    //         success(res) {
    //           console.log('getUserInfo')
    //           console.log(res)
    //           const { userInfo = {}, encryptedData = '', signature = '', iv = '' } = res;
    //           _this.setState({
    //             hasAuth: true,
    //             userInfo,
    //             encryptedData,
    //             signature,
    //             iv
    //           })
    //         },
    //         fail(err) {
    //           console.log('getUserInfo')
    //           console.log(err)
    //         }
    //       })
    //     }
    //   }
    // })
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  config = {
    navigationBarTitleText: '首页'
  }

  navigateTo = (url) => {
    Taro.navigateTo({
      url
    })
  }

  getUserInfo = (ev) => {
    const { env } = this.state;
    const { userInfo = {}, encryptedData = '', signature = '', iv = '' } = ev.detail;
    this.setState({
      hasAuth: true,
      userInfo,
      encryptedData,
      signature,
      iv
    })
    Taro.login({
      success(res) {
        console.log(res)
        const { code = '' } = res;
        if (code) {
          wx.cloud.callFunction({
            name: 'users',
            data: { action: 'addUser', env },
          }).then(res => {
            console.log(res)
            console.log('登录成功')
          }).catch(err => {
            console.log(err)
          })
        }
      },
      fail(err) {
        console.log(err)
      }
    })
  }

  render() {
    const { userInfo = {}, hasAuth = false } = this.state;
    return (
      <View className='index'>
        {
          !hasAuth ? <Button className='login_btn' open-type="getUserInfo" onGetUserInfo={this.getUserInfo} >使用微信登录</Button> : null
        }
        <View className='user_info_container'>
          <View className='user_info_item'>
            {
              userInfo.avatarUrl ? <AtAvatar image={userInfo.avatarUrl}></AtAvatar> : null
            }
          </View>
          <View className='user_info_item'>
            {
              userInfo.nickName ? <Text>你好，{userInfo.nickName}</Text> : null
            }
          </View>
        </View>
        <AtGrid onClick={item => {
          this.navigateTo(item.url)
        }} data={
          [
            {
              image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png',
              value: '我要点菜',
              url: '/pages/dishList/index'
            },
            {
              image: 'https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png',
              value: '添加类别',
              url: '/pages/dishInsert/index?type=sys'
            },
            {
              image: 'https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png',
              value: '添加新菜',
              url: '/pages/dishInsert/index?type=dish'
            },
            {
              image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png',
              value: '新品首发'
            },
            {
              image: 'https://img14.360buyimg.com/jdphoto/s72x72_jfs/t17251/336/1311038817/3177/72595a07/5ac44618Na1db7b09.png',
              value: '领京豆'
            },
            {
              image: 'https://img30.360buyimg.com/jdphoto/s72x72_jfs/t5770/97/5184449507/2423/294d5f95/595c3b4dNbc6bc95d.png',
              value: '手机馆'
            }
          ]
        } />
      </View>
    )
  }
}
