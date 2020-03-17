// // 云函数入口文件
const cloud = require('wx-server-sdk')

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
    case 'addUser': {
      return addUser(event)
    }
    case 'getUser': {
      return getUser(event)
    }
    case 'updateUser': {
      return updateUser(event)
    }
    // case 'getSecretAndId': {
    //   return getSecretAndId(event)
    // }
    default: {
      return;
    }
  }

  async function addUser(event) {
    const { userInfo = {} } = event;
    const { OPENID } = cloud.getWXContext()
    return await db.collection(`users`).add({
      data: {
        ...userInfo,
        open_id: OPENID
      }
    })
  }

  async function getUser(event) {
    const { OPENID } = cloud.getWXContext()
    return await db.collection(`users`).where({
      open_id: OPENID,
    }).get()
  }

  async function updateUser(event) {
    const { OPENID } = cloud.getWXContext()
    const { userInfo = {} } = event;
    return await db.collection(`users`).where({
      open_id: OPENID,
    }).update({
      // data 传入需要局部更新的数据
      data: { ...userInfo }
    })
  }

  // async function getSecretAndId(event) {
  //   return await db.collection(`common`).get()
  // }
}