// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database()
const DATABASE_ENV = process.env.NODE_ENV === 'development' ? 'dev_' : 'online_'

// 云函数入口函数

exports.main = async (event, context) => {
  const { action = '' } = event;
  if (!action) {
    throw new Error('请传入action标识操作！')
  }

  switch (event.action) {
    case 'addFoodSys': {
      return addFoodSys(event)
    }
    case 'getFoodSys': {
      return getFoodSys(event)
    }
    case 'getFoodsBySys': {
      return getFoodsBySys(event)
    }
    default: {
      return
    }
  }
}

async function addFoodSys(event) {
  const { name = '', desc = '' } = event;
  return await db.collection(`${DATABASE_ENV}sys`).add({
    data: {
      name,
      desc,
    }
  })
}

async function getFoodSys(event) {
  return await db.collection(`${DATABASE_ENV}sys`).get()
}

async function getFoodsBySys(event) {
  return await db.collection(`${DATABASE_ENV}sys`).aggregate()
    .lookup({
      from: `${DATABASE_ENV}foods`,
      localField: 'name',
      foreignField: 'sysName',
      as: 'containFoods',
    })
    .end()
}