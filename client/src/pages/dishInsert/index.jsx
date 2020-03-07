import "./index.less";

import {
  AtButton,
  AtFloatLayout,
  AtForm,
  AtImagePicker,
  AtInput,
  AtListItem,
  AtMessage,
  AtRadio,
  AtTextarea
} from "taro-ui";

import { View } from "@tarojs/components";
import Taro, { Component } from "@tarojs/taro";

// import DetailBanner from "../../components/detailBanner";
// import DetailList from "../../components/DetailList";

export default class DishInsert extends Component {
    constructor() {
        super();
        this.state = {
            type: this.$router.params.type,
            sysId: '',
            sysList: [],
            sysName: '',
            sysDesc: '',
            name: '',
            desc: '',
            pics: [{
                url: 'http://macdn.microants.cn/2/pro/952c69fcaf0b3c3284462f8169b9a9d91583161399543.jpg?x-oss-process=image/resize,w_350',
            }]
        }
    }

    componentWillMount() { }

    componentDidMount() {
        this.getFoodSys()
    }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    config = {
        navigationBarTitleText: '添加类别/新菜'
    }

    addFood = (data = {}) => {
        const _this = this;
        wx.cloud.callFunction({
            name: 'foods',
            data: { ...data, action: 'addFood' },
            complete: res => {
                console.log('callFunction test result: ', res)
                _this.onShowMessage('success', '添加新菜成功')
                _this.onReset()
            }
        })
    }

    getFoods = (data = {}) => {
        wx.cloud.callFunction({
            name: 'foods',
            data: { ...data, action: 'getFoods' },
            complete: (res = {}) => {
                console.log('callFunction test result: ', res)
            }
        })
    }

    addFoodSys = (data = {}) => {
        const _this = this;
        wx.cloud.callFunction({
            name: 'foodSys',
            data: { ...data, action: 'addFoodSys' },
            complete: res => {
                console.log('callFunction test result: ', res)
                _this.onShowMessage('success', '添加类别成功')
                _this.onReset()
            }
        })
    }

    getFoodSys = (data = {}) => {
        const _this = this;
        wx.cloud.callFunction({
            name: 'foodSys',
            data: { ...data, action: 'getFoodSys' },
            complete: (res = {}) => {
                const result = res.result && res.result.data || [];
                console.log('callFunction test result: ', result)
                _this.setState({
                    sysList: result.map(item => {
                        return { ...item, label: item.name, desc: item.desc, value: item._id }
                    })
                })
            }
        })
    }

    onShowMessage = (type = '', message = '') => {
        Taro.atMessage({
            message,
            type,
        })
    }

    onItemChange = (prop, value) => {
        if (prop === 'sysId') {
            const { sysList = [] } = this.state;
            const currentSysList = sysList.filter(item => item.value === value);
            let currentSysName = ''
            if (currentSysList && currentSysList.length) {
                currentSysName = currentSysList[0].label
            }
            this.setState({
                sysName: currentSysName,
                sysId: value
            })
            return;
        }
        if (value instanceof Object && !(value instanceof Array)) {
            this.setState({
                [prop]: value.target.value
            })
            return;
        }
        if (prop === 'pics' && value.length > 3) {
            Taro.atMessage({
                message: '最多上传3张图片！',
                type: 'fail',
            })
            return;
        }
        this.setState({
            [prop]: value
        })
    }

    onFail = (message) => {
        if (message.errMsg === 'chooseImage:fail cancel') {
            return;
        }
        Taro.atMessage({
            message: message.errMsg,
            type: 'fail',
        })
    }

    onImageClick = (index, file) => {

        console.log(index, file)
    }

    onDishSubmit = () => {
        const { name = '', desc = '', pics = [], sysId = '', sysName = '' } = this.state;
        const data = {
            name,
            desc,
            pics,
            sysId,
            sysName,
        }
        console.log(data)
        this.addFood(data)
    }

    onSysSubmit = () => {
        const { sysName = '', sysDesc = '' } = this.state;
        const data = {
            name: sysName,
            desc: sysDesc,
        }
        this.addFoodSys(data)
    }

    onReset = (ev) => {
        this.setState({
            sysName: '',
            sysDesc: '',
            sysId: '',
            name: '',
            desc: '',
            pics: []
        })
    }

    onToggleIsOpen = () => {
        const { isOpened } = this.state;
        this.setState({
            isOpened: !isOpened
        })
    }

    render() {
        const { isOpened = false, type = 'dish', sysId = '', sysList = [], sysName = '', sysDesc = '', name = '', desc = '', pics = [] } = this.state;
        return (
            <View >
                <AtMessage />
                {
                    type === 'dish' ? <AtForm
                        onSubmit={this.onDishSubmit.bind(this)}
                        onReset={this.onReset.bind(this)}
                    >
                        <AtInput
                            name='name'
                            title='菜名'
                            type='text'
                            placeholder='请输入新菜名称'
                            value={name}
                            onChange={this.onItemChange.bind(this, 'name')}
                        />
                        <AtTextarea
                            value={desc}
                            onChange={this.onItemChange.bind(this, 'desc')}
                            maxLength={200}
                            placeholder='请输入新菜简介'
                        />
                        <AtImagePicker
                            count={1}
                            files={pics}
                            showAddBtn={pics.length < 1}
                            onChange={this.onItemChange.bind(this, 'pics')}
                            onFail={this.onFail.bind(this)}
                            onImageClick={this.onImageClick.bind(this)}
                        />
                        <AtListItem
                            arrow='right'
                            title='选择新菜类别'
                            extraText={sysName}
                            onClick={this.onToggleIsOpen.bind(this)}
                        />

                        <View style={{ padding: '0 20px' }}>
                            <AtButton full={false} type='primary' formType='submit'>提交</AtButton>
                            <AtButton full={false} type='secondary' formType='reset'>重置</AtButton>
                        </View>

                    </AtForm> : <AtForm
                        onSubmit={this.onSysSubmit.bind(this)}
                        onReset={this.onReset.bind(this)}
                    >
                            <AtInput
                                name='sysName'
                                title='类别'
                                type='text'
                                placeholder='请输入新的类别'
                                value={sysName}
                                onChange={this.onItemChange.bind(this, 'sysName')}
                            />
                            <AtTextarea
                                value={sysDesc}
                                onChange={this.onItemChange.bind(this, 'sysDesc')}
                                maxLength={200}
                                placeholder='请输入类别的简介'
                            />

                            <View style={{ padding: '0 20px' }}>
                                <AtButton full={false} type='primary' formType='submit'>提交</AtButton>
                                <AtButton full={false} type='secondary' formType='reset'>重置</AtButton>
                            </View>
                        </AtForm>
                }
                <AtFloatLayout isOpened={isOpened} title="选择新菜类别" onClose={this.onToggleIsOpen.bind(this)}>
                    <AtRadio
                        options={sysList}
                        value={sysId}
                        onClick={(ev) => {
                            console.log(ev)
                            this.onItemChange('sysId', ev)
                            this.onToggleIsOpen()
                        }}
                    />
                </AtFloatLayout>
            </View>
        )
    }
}
