// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
// 云函数入口函数

exports.main = async (event, context) => {
  const { action = '' } = event;
  if (!action) {
    throw new Error('请传入action标识操作！')
  }

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
    default: {
      return
    }
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