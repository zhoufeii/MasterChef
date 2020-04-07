// 云函数入口文件
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
  const _ = db.command;

  switch (event.action) {
    case 'addFood': {
      return addFood(event)
    }
    case 'updateFood': {
      return updateFood(event)
    }
    case 'updateFoodStar': {
      return updateFoodStar(event)
    }
    case 'getFoodById': {
      return getFoodById(event)
    }
    case 'getFoods': {
      return getFoods(event)
    }

    default: {
      return
    }
  }

  async function addFood(event) {
    const { name = '', desc = '', sysId = '', sysName = '', pics = [] } = event;
    return await db.collection(`foods`).add({
      data: {
        name,
        desc,
        sysName,
        sysId,
        pics
      }
    })
  }

  async function updateFood(event) {
    const { id = '', name = '', desc = '', sysId = '', sysName = '', pics = [] } = event;
    const data = {
      name,
      desc,
      sysId,
      sysName,
      pics,
    }

    // for (prop in data) {
    //     if (!data[prop]) {
    //         delete data[prop]
    //     }
    // }

    return await db.collection('foods').doc(id).update({ data })
  }

  async function updateFoodStar(event) {
    const { id = '' } = event;
    return await db.collection(`foods`).doc(id).update({
      data: {
        star: _.inc(1)
      }
    })
  }

  async function getFoodById(event) {
    const { id = '' } = event
    return await db.collection('foods').doc(id).get()
  }

  async function getFoods(event) {
    const { name = '', pageNo = 0, pageSize = 10 } = event
    return await db.collection(`foods`).where(_.or([{
      name: db.RegExp({
        regexp: '.*' + name,
        options: 'i',
      })
    }
    ])).orderBy('star', 'desc').skip(pageNo * pageSize).limit(pageSize).get()
  }
}
