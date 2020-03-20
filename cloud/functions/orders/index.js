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
    case 'getOrder': {  // 获取某个订单
      return getOrder(event)
    }
    case 'getOrders': { // 获取当前用户全部订单
      return getOrders(event)
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
        createTime: new Date().getTime(),
        list,
        note,
        deliverDate: selectDate
      }
    })
  }

  async function getOrder(event) {
    const { id = '' } = event;

    if (!id) {
      return { msg: '订单id为空！' }
    }

    return await db.collection('orders').where({
      _id: id
    })
  }

  async function getOrders(event) {
    const { OPENID } = cloud.getWXContext()
    const { pageNo = 0, pageSize = 10 } = event

    return await db.collection('orders').where({
      userId: OPENID
    }).orderBy('createTime', 'desc').skip(pageNo * pageSize).limit(pageSize).get()
  }
}