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
import {
  getGlobalData,
  setGlobalData
} from "../../utils/globalData";
import { showToast } from "../../utils/index";

const ADMIN = 1;
const RABBIT = 2;
const OTHERS = 3;

export default class Index extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      hasAuth: false,
      userInfo: {},
      env: getGlobalData('env') || '',
      entranceList: [
        {
          image: 'https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/index_icon/%E7%B1%B3%E9%A5%AD.png',
          value: '我要吃饭',
          url: '/pages/menu/index',
          role: OTHERS,
        },
        {
          image: 'https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/index_icon/%E9%A4%90%E5%85%B7.png',
          value: '我的订单',
          url: '/pages/orderList/index',
          role: OTHERS,
        },
        {
          image: 'https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/index_icon/%E5%86%B0%E7%AE%B1.png',
          value: '我的冰箱',
          url: '/pages/foodList/index',
          role: OTHERS,
        },
        {
          image: 'https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/index_icon/%E5%A4%A7%E5%8E%A8%E5%B8%BD.png',
          value: '添加新菜',
          url: '/pages/add/index?type=dish',
          role: RABBIT,
        },
        {
          image: 'https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/index_icon/%E5%A4%A7%E5%8E%A8%E5%B8%BD.png',
          value: '添加类别',
          url: '/pages/add/index?type=sys',
          role: RABBIT,
        },
        {
          image: 'https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/index_icon/%E7%88%B1%E5%BF%83.png',
          value: '我爱兔兔',
          url: '/pages/love/index',
          role: RABBIT,
        }
      ],
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

  navigateTo = (url, role = OTHERS) => {
    const USER_TYPE = getGlobalData('USER_TYPE')
    if (USER_TYPE > role) {
      showToast('没有权限');
      return;
    }
    Taro.navigateTo({
      url
    })
  }

  buttonGetUserInfo = (ev) => {
    const _this = this;
    const { env, entranceList = [] } = _this.state;
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
            console.log('======buttonGetUserInfo====')
            console.log(res)
            const userList = res.result && res.result.data || [];
            if (!userList.length) {
              setGlobalData('USER_TYPE', OTHERS)
              Taro.cloud.callFunction({
                name: 'users',
                data: {
                  env,
                  action: 'addUser',
                  userInfo: { ...userInfo, USER_TYPE: OTHERS }
                },
              }).then(res => {
                _this.setState({
                  loading: false,
                  hasAuth: true,
                  userInfo: { ...userInfo, USER_TYPE: OTHERS },
                })
              }).catch(err => { })
            } else {
              setGlobalData('USER_TYPE', userList[0].USER_TYPE)
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
        const { userInfo = {}, } = res; // 这里获取到的userInfo是微信返回的，没有USER_TYPE
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
    const { env, entranceList = [], } = _this.state;
    Taro.cloud.callFunction({
      name: 'users',
      data: {
        action: 'getUser',
        env
      }
    }).then(res => {
      const userList = res.result && res.result.data || [];
      if (userList.length) {
        console.log('========userList[0]======')
        console.log(userList[0])
        setGlobalData('USER_TYPE', userList[0].USER_TYPE)
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
      _this.getUser()
    }).catch(err => {
      console.log(err)
    })
  }

  render() {
    const { userInfo = {}, hasAuth = false, loading = true, entranceList = [] } = this.state;

    return (
      <View className='index'>
        <Banner userInfo={userInfo} />
        <View className='loading_wrapper'>
          {
            loading ? <AtActivityIndicator content='加载中...' ></AtActivityIndicator> : null
          }
        </View>
        {
          !loading && !hasAuth ? <Button className='login_btn' open-type="getUserInfo" onGetUserInfo={this.buttonGetUserInfo} >使用微信登录</Button> : null
        }
        {
          userInfo.USER_TYPE ? <View>
            <View className='user_info_container'>
              <View className='user_info_item'>
                {
                  userInfo.nickName ? <Text>你好，{userInfo.nickName}</Text> : null
                }
              </View>
            </View>
            <AtGrid onClick={item => {
              this.navigateTo(item.url, item.role)
            }} data={entranceList} />
          </View> : null
        }
      </View>
    )
  }
}
