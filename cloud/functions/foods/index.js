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
        case 'addFood': {
            return addFood(event)
        }
        case 'getFoods': {
            return getFoods(event)
        }
        default: {
            return
        }
    }
}

async function addFood(event) {
    const { name = '', desc = '', sysId = '', sysName = '', pics = [] } = event;
    return await db.collection(`${DATABASE_ENV}foods`).add({
        data: {
            name,
            desc,
            sysName,
            sysId,
            pics
        }
    })
}

async function getFoods(event) {
    return await db.collection(`${DATABASE_ENV}foods`).get()
}
