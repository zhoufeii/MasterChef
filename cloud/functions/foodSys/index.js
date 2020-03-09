// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database()
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
  return await db.collection('dev_sys').add({
    data: {
      name,
      desc,
    }
  })
}

async function getFoodSys(event) {
  return await db.collection('dev_sys').get()
}

async function getFoodsBySys(event) {
  return await db.collection('dev_sys').aggregate()
    .lookup({
      from: 'dev_foods',
      localField: 'name',
      foreignField: 'sysName',
      as: 'containFoods',
    })
    .end()
  // .then(res => console.log(res))
  // .catch(err => console.error(err))
  // return await db.collection('dev_foods').where({ sysId: event.sysId || '' }).get()
}