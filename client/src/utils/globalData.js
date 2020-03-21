const globalData = {
    ADMIN: 1,
    RABBIT: 2,
    OTHERS: 3,
}

const setGlobalData = function (key, val) {
    globalData[key] = val
}
const getGlobalData = function (key) {
    return globalData[key]
}

module.exports = {
    setGlobalData,
    getGlobalData
}