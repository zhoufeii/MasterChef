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
    case 'addFoodSys': {
      return addFoodSys(event)
    }
    case 'getFoodSys': {
      return getFoodSys(event)
    }
    case 'getFoodSysById': {
      return getFoodSysById(event)
    }
    case 'getFoodsBySys': {
      return getFoodsBySys(event)
    }
    default: {
      return
    }
  }

  async function addFoodSys(event) {
    const { name = '', desc = '' } = event;
    return await db.collection(`sys`).add({
      data: {
        name,
        desc,
      }
    })
  }

  async function getFoodSys(event) {
    return await db.collection(`sys`).get()
  }

  async function getFoodSysById(event) {
    const { id = '' } = event;
    return await db.collection(`sys`).doc(id).get()
  }

  async function getFoodsBySys(event) {
    return await db.collection(`sys`).aggregate()
      .lookup({
        from: `foods`,
        localField: '_id',
        foreignField: 'sysId',
        as: 'containFoods',
      })
      .end()
  }
}
