// 云函数入口文件
// const cloud = require("wx-server-sdk");
// cloud.init({
//   env: cloud.DYNAMIC_CURRENT_ENV
// });
// const db = cloud.database({
//   env: cloud.DYNAMIC_CURRENT_ENV
// })
// const DATABASE_ENV = process.env.NODE_ENV === 'dev-uel3w' ? 'dev_' : 'online_'

// // 云函数入口函数

// exports.main = async (event, context) => {
//   const { action = '' } = event;
//   if (!action) {
//     throw new Error('请传入action标识操作！')
//   }

//   switch (event.action) {
//     case 'addFoodSys': {
//       return addFoodSys(event)
//     }
//     case 'getFoodSys': {
//       return getFoodSys(event)
//     }
//     case 'getFoodsBySys': {
//       return getFoodsBySys(event)
//     }
//     default: {
//       return
//     }
//   }
// }

// async function addFoodSys(event) {
//   const { name = '', desc = '' } = event;
//   console.log(`${DATABASE_ENV}sys`)
//   return await db.collection(`sys`).add({
//     data: {
//       name,
//       desc,
//     }
//   })
// }

// async function getFoodSys(event) {
//   return await db.collection(`sys`).get()
// }

// async function getFoodsBySys(event) {
//   return await db.collection(`sys`).aggregate()
//     .lookup({
//       from: `foods`,
//       localField: 'name',
//       foreignField: 'sysName',
//       as: 'containFoods',
//     })
//     .end()
// }

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

  async function getFoodsBySys(event) {
    return await db.collection(`sys`).aggregate()
      .lookup({
        from: `foods`,
        localField: 'name',
        foreignField: 'sysName',
        as: 'containFoods',
      })
      .end()
  }
}