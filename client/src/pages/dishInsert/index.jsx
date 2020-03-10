import "./index.less";

import {
  AtActivityIndicator,
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

import { getGlobalData } from "../../utils/globalData";
import {
  cloudUploadImage,
  errorHandler,
  showToast
} from "../../utils/index";

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
            pics: [],
            loading: false,
            env: getGlobalData('env') || ''
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

    upload = (dir, event, callback) => {
        this.setState({
            loading: true
        }, cloudUploadImage.bind(this, dir, event, callback))
    }

    updatePics = (res) => {
        const fileList = res.result && res.result.fileList || [];
        const url = fileList.length && fileList[0] && fileList[0].tempFileURL || ''
        this.setState({
            pics: [{ url }],
            loading: false
        })
    }

    addFood = (data = {}) => {
        const _this = this;
        const { env } = _this.state;

        wx.cloud.callFunction({
            name: 'foods',
            data: { ...data, action: 'addFood', env },
        }).then(res => {
            showToast('添加新菜成功', 'success')
            _this.onReset()
        }).catch(errorHandler)
    }

    getFoods = (data = {}) => {
        const { env } = this.state;
        wx.cloud.callFunction({
            name: 'foods',
            data: { ...data, action: 'getFoods', env },
            complete: (res = {}) => { }
        })
    }

    addFoodSys = (data = {}) => {
        const _this = this;
        const { env } = _this.state;

        wx.cloud.callFunction({
            name: 'foodSys',
            data: { ...data, action: 'addFoodSys', env },
        }).then(res => {
            showToast('添加类别成功', 'success')
            _this.onReset()
        }).catch(errorHandler)
    }

    getFoodSys = (data = {}) => {
        const _this = this;
        const { env } = _this.state;

        wx.cloud.callFunction({
            name: 'foodSys',
            data: { ...data, action: 'getFoodSys', env },
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
            message: message || message.errMsg,
            type: 'fail',
        })
    }

    onImageClick = (index, file) => {
        console.log(index, file)
    }

    onDishSubmit = () => {
        const { name = '', desc = '', sysId = '', sysName = '', pics = [] } = this.state;
        const data = {
            name,
            desc,
            sysId,
            sysName,
            pics
        }
        if (!name) {
            showToast('名称不可为空~');
            return;
        }
        if (!sysId) {
            showToast('所属分类不可为空~');
            return;
        }

        this.setState({
            loading: true
        }, this.addFood.bind(this, data))
    }

    onSysSubmit = () => {
        const { sysName = '', sysDesc = '' } = this.state;
        const data = {
            name: sysName,
            desc: sysDesc,
        }
        if (!sysName) {
            showToast('分类名称不可为空~');
            return;
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
            pics: [],
            loading: false
        })
    }

    onToggleIsOpen = () => {
        const { isOpened } = this.state;
        this.setState({
            isOpened: !isOpened
        })
    }

    render() {
        const { isOpened = false, loading = false, type = 'dish', sysId = '', sysList = [], sysName = '', sysDesc = '', name = '', desc = '', pics = [], } = this.state;
        return (
            <View >
                <AtMessage />
                {
                    loading ? <AtActivityIndicator content='加载中...' mode='center'></AtActivityIndicator> : null
                }
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
                            onChange={(event) => {
                                // this.onItemChange.bind(this, 'pics')
                                this.upload('foods', event, this.updatePics.bind(this))
                            }}
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
                            this.onItemChange('sysId', ev)
                            this.onToggleIsOpen()
                        }}
                    />
                </AtFloatLayout>
            </View>
        )
    }
}
