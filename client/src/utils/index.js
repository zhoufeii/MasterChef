// 上传图片
import Taro from "@tarojs/taro";

const errorHandler = (error) => {
    const errorMsg = error.errMsg || error.errMessage || error.errorMessage || error.errorMsg || '';
    Taro.showToast({
        title: errorMsg,
        // image: require('../assets/images/error.png'),
        mask: true,
        duration: 1500
    });
}

const showToast = (title = '', icon = '', callback = () => { }) => {
    Taro.showToast({
        title,
        icon: icon || 'none',
        // image: require('../assets/images/success.png'),
        mask: true,
        duration: 1500
    }).then(res => {
        callback()
    })
}

const cloudUploadImage = (env, dir, event, callback) => {
    const filePath = event[0].url;
    Taro.getFileSystemManager().readFile({
        filePath, //选择图片返回的相对路径
        encoding: 'base64', //编码格式
        success: (res) => {
            Taro.cloud.callFunction({
                name: 'utils',
                data: {
                    action: 'upload',
                    env,
                    cloudPath: `${dir}/${Date.now()}_${Math.floor(Math.random() * 100000)}.png`,
                    fileContent: res.data
                }
            }).then(res => {
                const fileID = res.result.fileID;
                Taro.cloud.callFunction({
                    name: 'utils',
                    data: {
                        action: 'exchangeLink',
                        env,
                        fileList: [fileID]
                    }
                }).then(res => {
                    callback(res)
                }).catch(err => {
                    console.log(err)
                })
            }).catch(err => {
                console.log(err)
            })
        },
        fail: (err) => {
            console.log(err)
        }
    })
}



module.exports = {
    errorHandler,
    showToast,
    cloudUploadImage
}