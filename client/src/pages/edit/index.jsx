import "./index.less";

import {
  AtButton,
  AtFloatLayout,
  AtForm,
  AtImagePicker,
  AtInput,
  AtListItem,
  AtRadio,
  AtTextarea
} from "taro-ui";

import { View } from "@tarojs/components";
import { Component } from "@tarojs/taro";

import Loading from "../../components/loading";
import { getGlobalData } from "../../utils/globalData";
import {
  cloudUploadImage,
  showToast
} from "../../utils/index";

export default class DishEdit extends Component {
    constructor() {
        super();
        this.state = {
            type: this.$router.params.type, // 编辑菜品/编辑类别
            id: this.$router.params.id,
            sysId: '',
            sysList: [],
            sysName: '',
            sysDesc: '',
            name: '',
            desc: '',
            pics: [],
            loading: true,
            env: getGlobalData('env') || ''
        }
    }

    componentWillMount() { }

    componentDidMount() {
        this.getFoodSys()

        const { type, id } = this.state;
        if (type === 'dish') {
            this.getFoodById(id)
        } else if (type === 'sys') {
            this.getFoodSysById(id)
        }
    }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    config = {
        navigationBarTitleText: '编辑类别/新菜'
    }

    backTo = (delta = 1) => {
        const pages = getCurrentPages();
        const FoodListComponent = pages[getCurrentPages().length - 2]
        FoodListComponent.$component.setState({
            name: '',
            list: [],
            pageNo: 0,
            pageSize: 10,
            noMore: false,
            loading: true,
            initialCompleted: false
        }, () => {
            FoodListComponent.$component.handleGetFoodList()
            Taro.navigateBack({ delta })
        })

    }

    upload = (dir, event, callback) => {
        const { env } = this.state;
        this.setState({
            loading: true
        }, cloudUploadImage.bind(this, env, dir, event, callback))
    }

    updatePics = (res) => {
        const fileList = res.result && res.result.fileList || [];
        const url = fileList.length && fileList[0] && fileList[0].tempFileURL || ''
        this.setState({
            pics: [{ url }],
            loading: false
        })
    }

    getFoodById = (id) => {
        const { env } = this.state;
        Taro.cloud.callFunction({
            name: 'foods',
            data: { id, action: 'getFoodById', env },
        }).then(res => {
            console.log('=======res=====')
            console.log(res)
            const { name = '', desc = '', pics = [], sysId = '', sysName = '' } = res.result.data;
            this.setState({
                name,
                desc,
                pics,
                sysId,
                sysName,
                loading: false,
            })
        }).catch(err => {
            console.log(err)
        })
    }

    getFoodSysById = (id) => {
        const { env } = this.state;
        Taro.cloud.callFunction({
            name: 'foodSys',
            data: { id, action: 'getFoodSysById', env },
        }).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
    }

    getFoodSys = () => {
        const _this = this;
        const { env } = _this.state;

        Taro.cloud.callFunction({
            name: 'foodSys',
            data: { action: 'getFoodSys', env },
        }).then(res => {
            const result = res.result && res.result.data || [];
            _this.setState({
                sysList: result.map(item => {
                    return { ...item, label: item.name, desc: item.desc, value: item._id }
                }),
                loading: false,
            })
        }).catch(err => {
            console.log(err)
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
            showToast('最多上传3张图片！');
            // Taro.atMessage({
            //     message: '最多上传3张图片！',
            //     type: 'fail',
            // })
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
        showToast(message || message.errMsg || '上传图片失败，请联系大熊~');
    }

    onDishSubmit = () => {
        const { env = '', id = '', name = '', desc = '', sysId = '', sysName = '', pics = [] } = this.state;
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
        })

        Taro.cloud.callFunction({
            name: 'foods',
            data: { ...data, action: 'updateFood', env, id },
        }).then(res => {
            showToast('修改菜品成功！', 'success')
            setTimeout(() => {
                this.backTo()
            }, 1000)
        }).catch(err => {
            showToast('修改菜品失败，请联系大熊！')
        })

        this.setState({
            loading: false
        })
    }

    onSysSubmit = () => {
        const { sysName: name = '', sysDesc: desc = '' } = this.state;
        const data = {
            name,
            desc,
        }
        if (!sysName) {
            showToast('分类名称不可为空~');
            return;
        }
    }

    onToggleIsOpen = () => {
        const { isOpened } = this.state;
        this.setState({
            isOpened: !isOpened
        })
    }

    render() {
        const { isOpened = false, loading = true, type = 'dish', sysId = '', sysList = [], sysName = '', sysDesc = '', name = '', desc = '', pics = [], } = this.state;
        return (
            <View className='add'>
                {/* <AtMessage /> */}
                {/* {
                    loading ? <AtActivityIndicator content='加载中...' mode='center'></AtActivityIndicator> : null
                } */}
                <Loading loading={loading} initialCompleted={false} />
                {
                    type === 'dish' ? <AtForm onSubmit={this.onDishSubmit.bind(this)} >
                        <AtInput
                            name='name'
                            title='菜名'
                            type='text'
                            placeholder='请输入要修改的新菜名称'
                            value={name}
                            onChange={this.onItemChange.bind(this, 'name')}
                        />
                        <AtTextarea
                            value={desc}
                            onChange={this.onItemChange.bind(this, 'desc')}
                            maxLength={200}
                            placeholder='请输入要修改的新菜简介'
                        />
                        <AtImagePicker
                            count={1}
                            files={pics}
                            showAddBtn={pics.length < 1}
                            onChange={(event) => {
                                if (event && event.length === 0) {
                                    this.setState({
                                        pics: []
                                    })
                                } else {
                                    this.upload('foods', event, this.updatePics.bind(this))
                                }
                            }}
                            onFail={this.onFail.bind(this)}
                        />
                        <AtListItem
                            arrow='right'
                            title='选择新菜类别'
                            extraText={sysName}
                            onClick={this.onToggleIsOpen.bind(this)}
                        />

                        <View style={{ padding: '10px 20px 20px' }}>
                            <AtButton full={false} type='primary' formType='submit'>提交修改</AtButton>
                            <AtButton full={false} type='secondary' formType='reset'>重置</AtButton>
                        </View>

                    </AtForm> : <AtForm
                        onSubmit={this.onSysSubmit.bind(this)}
                    >
                            <AtInput
                                name='sysName'
                                title='类别'
                                type='text'
                                placeholder='请输入要修改的类别'
                                value={sysName}
                                onChange={this.onItemChange.bind(this, 'sysName')}
                            />
                            <AtTextarea
                                value={sysDesc}
                                onChange={this.onItemChange.bind(this, 'sysDesc')}
                                maxLength={200}
                                placeholder='请输入要修改的类别简介'
                            />

                            <View style={{ padding: '10px 20px 20px' }}>
                                <AtButton full={false} type='primary' formType='submit'>提交修改</AtButton>
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
