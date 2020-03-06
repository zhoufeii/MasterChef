
function addFoodSys(data, scb, fcb) {
    const db = wx.cloud.database()
    db.collection('dev_sys').add({ data }).then(res => {
        scb(res.data)
    }).catch(error => {
        fcb(error)
    })
}

function getFoodSys(data, scb, fcb) {
    const db = wx.cloud.database()
    db.collection('dev_sys').get().then(res => {
        scb(res.data)
    }).catch(error => {
        fcb(error)
    })
}

function addFood(data, scb, fcb) {
    const db = wx.cloud.database()
    db.collection('dev_foods').add({ data }).then(res => {
        scb(res.data)
    }).catch(error => {
        fcb(error)
    })
}

function getFood(data, scb, fcb) {
    const db = wx.cloud.database()
    db.collection('dev_foods').get().then(res => {
        scb(res.data)
    }).catch(error => {
        fcb(error)
    })
}

function getFoodBySys(data, scb, fcb) {
    const db = wx.cloud.database()
    db.collection('dev_foods').where(data).get().then(res => {
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

