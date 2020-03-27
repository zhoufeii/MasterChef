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
  const _ = db.command;

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
    const { deliverDate = '', list = [], note = '' } = event;
    const { OPENID } = cloud.getWXContext()
    console.log(list)
    list.map(item => {
      console.log(item)
      cloud.callFunction({
        name: 'foods',
        data: {
          action: 'updateFoodStar',
          env,
          id: item.id,
        }
      }).then(res => console.log(`${item.name} 自增成功`))
        .catch(err => console.log(err))
    })

    return await db.collection(`orders`).add({
      data: {
        userId: OPENID,
        createTime: new Date().getTime(),
        list,
        note,
        deliverDate
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
    }).get()
  }

  async function getOrders(event) {
    const { OPENID } = cloud.getWXContext()
    const { pageNo = 0, pageSize = 10 } = event

    return await db.collection('orders').where({
      userId: OPENID
    }).orderBy('createTime', 'desc').skip(pageNo * pageSize).limit(pageSize).get()
  }
}