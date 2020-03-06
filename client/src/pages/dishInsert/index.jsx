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

import {
  addFood,
  addFoodSys,
  getFood,
  getFoodSys
} from "../../service/index";

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
            },
            {
                url: 'http://macdn.microants.cn/2/pro/952c69fcaf0b3c3284462f8169b9a9d91583161399543.jpg?x-oss-process=image/resize,w_350',
            },
            {
                url: 'http://macdn.microants.cn/2/pro/952c69fcaf0b3c3284462f8169b9a9d91583161399543.jpg?x-oss-process=image/resize,w_350',
            }]
        }
    }

    componentWillMount() { }

    componentDidMount() {
        getFoodSys(null, (res) => {
            console.log(res)
            this.setState({
                sysList: res.map(item => {
                    return { ...item, label: item.name, desc: item.desc, value: item._id }
                })
            })
        }, (error) => {
            console.log(error)
        })

        getFood(null, (res) => {
            console.log(res)
        }, (error) => {
            console.log(error)
        })
    }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    config = {
        navigationBarTitleText: '添加类别/新菜'
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
                sysName: currentSysName
            })
        }
        if (value instanceof Object) {
            this.setState({
                [prop]: value.target.value
            }, () => {
                console.log(this.state)
            })
            return;
        }
        this.setState({
            [prop]: value
        }, () => {
            console.log(this.state)
        })
    }

    onFail = (message) => {
        Taro.atMessage({
            message,
            type: 'fail',
        })
    }

    onImageClick = (index, file) => {
        console.log(index, file)
    }

    onDishSubmit = () => {
        const { name = '', desc = '', pics = [], sysId = '', sysName = '' } = this.state;
        console.log(this.state)
        const data = {
            name,
            desc,
            pics,
            sysId,
            sysName,
        }
        // console.log(data)
        addFood(data, (res) => {
            this.onShowMessage('success', '添加新菜成功')
            this.onReset()
        }, (error) => {
            console.log(error)
        })
    }

    onSysSubmit = () => {
        const { sysName = '', sysDesc = '' } = this.state;
        const data = {
            name: sysName,
            desc: sysDesc,
        }
        addFoodSys(data, (res) => {
            this.onShowMessage('success', '添加类别成功')
            this.onReset()
        }, (error) => {
            console.log(error)
        })
    }

    onReset = (ev) => {
        console.log(ev)
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
                            multiple
                            files={pics}
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
                            this.onItemChange('sysId', ev)
                            this.onToggleIsOpen()
                        }}
                    />
                </AtFloatLayout>
            </View>
        )
    }
}
