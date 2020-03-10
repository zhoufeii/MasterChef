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
}