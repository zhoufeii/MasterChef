const globalData = {}

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