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

    async function getFoods(event) {
        const { pageNo = 0, pageSize = 10 } = event
        return await db.collection(`foods`).skip(pageNo * pageSize).limit(pageSize).get()
    }
}