import "./index.less";

import {
  AtActivityIndicator,
  AtGrid
} from "taro-ui";

import {
  Button,
  View
} from "@tarojs/components";
import { Component } from "@tarojs/taro";

import Banner from "../../components/banner";
import { getGlobalData } from "../../utils/globalData";

export default class Index extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      hasAuth: false,
      userInfo: {},
      env: getGlobalData('env') || ''
    }
  }

  componentWillMount() { }

  componentDidMount() {
    const _this = this;
    Taro.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          Taro.authorize({
            scope: 'scope.userInfo',
          }).then(res => {
            _this.autoGetUserInfo()
          }).catch(err => {
            _this.setState({
              loading: false
            })
            console.log(err)  // 没有获得授权
            // _this.getUser()
          })
        } else {
          _this.autoGetUserInfo()
        }
      }
    })
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

  buttonGetUserInfo = (ev) => {
    const _this = this;
    const { env } = _this.state;
    const { userInfo = {} } = ev.detail;
    Taro.login({
      success(res) {
        const { code: CODE = '' } = res;
        if (CODE) {
          Taro.cloud.callFunction({
            name: 'users',
            data: {
              action: 'getUser',
              env
            }
          }).then(res => {
            console.log(res)
            // const storageUserId = res && res.result && res.result.data && res.result.data[0] && res.result.data[0]._id || '';
            const userList = res.result && res.result.data || [];
            if (!userList.length) {
              Taro.cloud.callFunction({
                name: 'users',
                data: {
                  env,
                  action: 'addUser',
                  userInfo: { ...userInfo, userType: 2 }
                },
              }).then(res => {
                _this.setState({
                  loading: false,
                  hasAuth: true,
                  userInfo,
                })
              }).catch(err => { })
            } else {
              _this.setState({
                loading: false,
                hasAuth: true,
                userInfo: userList[0],
              })
            }

            // try {
            //   Taro.setStorageSync('USER_ID', storageUserId)
            // } catch (e) {
            //   console.log(e)
            // }

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

  autoGetUserInfo = () => {
    const _this = this;
    Taro.getUserInfo({
      success(res) {
        const { userInfo = {}, } = res;
        _this.setState({
          hasAuth: true,
          userInfo,
        }, _this.updateUser)
      },
      fail(err) {
        console.log(err)
      }
    })
  }

  getUser = () => {
    const _this = this;
    const { env } = _this.state;
    Taro.cloud.callFunction({
      name: 'users',
      data: {
        action: 'getUser',
        env
      }
    }).then(res => {
      const userList = res.result && res.result.data || [];
      if (userList.length) {
        _this.setState({
          loading: false,
          hasAuth: true,
          userInfo: userList[0],
        })
      }
    }).catch(err => {
      console.log(err)
    })
  }

  updateUser = () => {
    const _this = this;
    const { env, userInfo } = _this.state;
    Taro.cloud.callFunction({
      name: 'users',
      data: {
        env,
        action: 'updateUser',
        userInfo
      }
    }).then(res => {
      // const userList = res.result && res.result.data || [];
      // if (userList.length) {
      _this.getUser()
      // _this.setState({
      //   loading: false,
      //   hasAuth: true,
      //   userInfo: { ...userInfo },
      // })
      // }
    }).catch(err => {
      console.log(err)
    })
  }

  render() {
    const { userInfo = {}, hasAuth = false, loading = true, } = this.state;
    return (
      <View className='index'>
        <Banner />
        <View className='loading_wrapper'>
          {
            loading ? <AtActivityIndicator content='加载中...' ></AtActivityIndicator> : null
          }
        </View>
        {
          !loading && !hasAuth ? <Button className='login_btn' open-type="getUserInfo" onGetUserInfo={this.buttonGetUserInfo} >使用微信登录</Button> : null
        }
        {
          userInfo.userType ? <View>
            {/* <View className='user_info_container'>
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
            </View> */}
            <AtGrid onClick={item => {
              this.navigateTo(item.url)
            }} data={
              [
                {
                  image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png',
                  value: '我要点菜',
                  url: '/pages/menu/index'
                },
                {
                  image: 'https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png',
                  value: '添加类别',
                  url: '/pages/add/index?type=sys'
                },
                {
                  image: 'https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png',
                  value: '添加新菜',
                  url: '/pages/add/index?type=dish'
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
          </View> : null
        }
      </View>
    )
  }
}
