// // 云函数入口文件
const cloud = require('wx-server-sdk')
const Core = require('@alicloud/pop-core');

const client = new Core({
  accessKeyId: 'LTAI4FrfUcV6RLmC2f8x8dZs',
  accessKeySecret: 'QVt5VCvn23RvVAMfOrbaL3dcpKpp8W',
  endpoint: 'https://dysmsapi.aliyuncs.com',
  apiVersion: '2017-05-25'
});

const params = {
  "RegionId": "cn-hangzhou",
  "PhoneNumbers": "18868412098",
  "SignName": "小曹课程管家",
  "TemplateCode": "SMS_123669090",
  "TemplateParam": "{\"weekday\":\"星期一\",\"course\":\"语文\"}"
}

const requestOption = {
  method: 'POST'
};

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
      let msgContent = message.data.list.map(item => ({ name: item.name }));
      let finalText = '';

      for (let i = 0; i < msgContent.length; i++) {
        finalText += `${msgContent[i].name},`;
        if (finalText.length > 7) break;
      }
      debugger;
      finalText = finalText.substring(0, finalText.length - 1)
      finalText = finalText.length === 7 ? finalText += `等菜品` : finalText
      // msgContent = msgContent.length > 20 ? `${msgContent.substring(0, 17)}...` : msgContent

      console.log(finalText)
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
              value: finalText,  // 存在长度限制，20个字符
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

    client.request('SendSms', params, requestOption).then((result) => {
      console.log(JSON.stringify(result));
    }, (ex) => {
      console.log(ex);
    })

    return Promise.all(sendPromises);
  }
}