// 云函数入口文件
const cloud = require('wx-server-sdk')

exports.main = async event => {
  const { action = '', env = '' } = event;

  if (!action) {
    throw new Error('请传入action标识操作！')
  }
  if (!env) {
    throw new Error('环境ID为空！')
  }

  cloud.init({ env })
  const db = cloud.database({ env })

  switch (event.action) {
    case 'addOrder': {
      return addOrder(event)
    }
    default: {
      return
    }
  }

  async function addOrder(event) {
    const { selectDate = '', list = [], note = '' } = event;
    const { OPENID } = cloud.getWXContext()

    return await db.collection(`orders`).add({
      data: {
        userId: OPENID,
        createTime: selectDate,
        list,
        note
      }
    })
  }
}