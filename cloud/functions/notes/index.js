// // 云函数入口文件
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
    case 'getRecentNote': {
      return getRecentNote(event)
    }
    default: {
      return;
    }
  }

  async function getRecentNote(event) {
    const { OPENID } = cloud.getWXContext()
    const result = await db.collection('orders').where({
      userId: OPENID,
      note: _.neq('')
    }).orderBy('createTime', 'desc').limit(5).get();
    console.log(result.data)
    if (result.data && result.data.length) {
      const arraySet = new Set(result.data.map(item => item.note))
      const noRepeatNotes = Array.from(arraySet)
      return new Promise((resolve, reject) => {
        resolve(noRepeatNotes)
      })
    }

  }
}