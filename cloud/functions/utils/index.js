// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise');
// const WXBizDataCrypt = require('../../../client/src/utils/WXBizDataCrypt')

exports.main = async event => {
  const { action = '', env = '' } = event;

  if (!env) {
    throw new Error('环境ID为空！')
  }
  if (!action) {
    throw new Error('请传入action标识操作！')
  }

  cloud.init({ env })
  const db = cloud.database({ env })

  switch (event.action) {
    case 'upload': {
      return upload(event)
    }
    case 'download': {
      return download(event)
    }
    case 'exchangeLink': {
      return exchangeLink(event)
    }
    // case 'code2Session': {
    //   return code2Session(event)
    // }
    default: {
      return
    }
  }

  async function upload(event) {
    const { cloudPath, fileContent } = event;
    return await cloud.uploadFile({
      cloudPath,
      fileContent: Buffer.from(fileContent, 'base64')
    })
  }

  async function download(event) {
    const { fileID } = event
    return await cloud.downloadFile({
      fileID,
    })
  }

  async function exchangeLink(event) {
    const { fileList } = event
    return await cloud.getTempFileURL({
      fileList,
    })
  }

  // async function code2Session(event) {
  //   const { CODE = '', iv = '', encryptedData = '' } = event
  //   cloud.callFunction({
  //     name: 'users',
  //     data: {
  //       action: 'getSecretAndId',
  //       env,
  //     }
  //   }).then((res = {}) => {
  //     const result = res.result && res.result.data && res.result.data.length && res.result.data[0];
  //     const { APPID = '', SECRET = '', } = result;
  //     rp(`https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${SECRET}&js_code=${CODE}&grant_type=authorization_code`).then(res => {
  //       const { session_key: sessionKey = '' } = JSON.parse(res);
  //       const pc = new WXBizDataCrypt(APPID, sessionKey)
  //       const data = pc.decryptData(encryptedData, iv)
  //       console.log(data)
  //     }).catch(err => {
  //       console.log(err)
  //     })
  //   }).catch(err => {
  //     console.log(err)
  //   })
  // }
}



