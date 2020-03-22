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

  switch (event.action) {
    case 'addSubscribeMessage': {
      return addSubscribeMessage(event)
    }
    case 'sendSubscribeMessage': {
      return sendSubscribeMessage(event)
    }
    default: {
      return;
    }
  }

  async function addSubscribeMessage(event) {
    const { deliverDate = '', list = [], templateId = '', page = '' } = event;
    const { OPENID } = cloud.getWXContext()
    return await db.collection(`subscribeMessage`).add({
      data: {
        touser: OPENID,
        data: {
          deliverDate,
          list
        },
        page,
        templateId,
        done: false,
      }
    })
  }

  async function sendSubscribeMessage(event) {
    const { OPENID } = cloud.getWXContext()
    const messages = await db
      .collection('subscribeMessage')
      // 查询条件这里做了简化，只查找了状态为未发送的消息
      .where({
        done: false,
        touser: OPENID,
      })
      .get();

    // 循环消息列表
    const sendPromises = messages.data.map(async message => {
      let msgContent = message.data.list.map(item => ({ name: item.name, count: item.count })).map(item => `${item.name}*${item.count}`).join(',')
      msgContent = msgContent.length > 20 ? `${msgContent.substring(0, 17)}...` : msgContent
      try {
        // 发送订阅消息
        await cloud.openapi.subscribeMessage.send({
          touser: message.touser,
          page: message.page,
          data: {
            thing2: {
              value: '熊家厨房【官方直营】',
            },
            date6: {
              value: message.data.deliverDate,
            },
            thing9: {
              value: msgContent,  // 存在长度限制，20个字符
            },
            phrase10: {
              value: '已下单', // 暂时固定为已下单，之后会动态改变状态
            },
          },
          templateId: message.templateId,
          miniprogramState: 'developer'
        });
        // 发送成功后将消息的状态改为已发送
        return db
          .collection('subscribeMessage')
          .doc(message._id)
          .update({
            data: {
              done: true,
            },
          });
      } catch (err) {
        console.log(err)
      }
    });

    return Promise.all(sendPromises);
  }
}