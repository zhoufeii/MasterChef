let env = process.env.NODE_ENV === 'online-p5ijz' ? 'online' : 'dev'
// TODO:改写为云函数！！！！

function addFoodSys(data, scb, fcb) {
    const db = wx.cloud.database()
    db.collection(`${env}_sys`).add({ data }).then(res => {
        scb(res.data)
    }).catch(error => {
        fcb(error)
    })
}

function getFoodSys(data, scb, fcb) {
    const db = wx.cloud.database()
    db.collection(`${env}_sys`).get().then(res => {
        scb(res.data)
    }).catch(error => {
        fcb(error)
    })
}

function addFood(data, scb, fcb) {
    const db = wx.cloud.database()
    db.collection(`${env}_foods`).add({ data }).then(res => {
        scb(res.data)
    }).catch(error => {
        fcb(error)
    })
}

function getFood(data, scb, fcb) {
    const db = wx.cloud.database()
    db.collection(`${env}_foods`).get().then(res => {
        scb(res.data)
    }).catch(error => {
        fcb(error)
    })
}

function getFoodBySys(data, scb, fcb) {
    const db = wx.cloud.database()
    db.collection(`${env}_foods`).where(data).get().then(res => {
        scb(res.data)
    }).catch(error => {
        fcb(error)
    })
}

module.exports = {
    addFoodSys,
    getFoodSys,
    addFood,
    getFood,
    getFoodBySys
}

