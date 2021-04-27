import {
    get,
    post,
    upload
} from './helpers'
const urlMap = {
    development: ["http://api.menupls.my/", 'http://ad.menupls.my/'],
    production: ["http://api.menupls.my/", 'http://ad.menupls.my/']
}
const baseUrl = urlMap[process.env.NODE_ENV]

const login = get(baseUrl[0] + 'login')

const getOrderCount = get(baseUrl[0] + 'order/count')
const getWaimaiOrderList = get(baseUrl[0] + "order/list") //外卖订单列表
const getWaimaiOrderDetail = get(baseUrl[0] + "order/detail") //外卖订单详情
const cancelOrder = post(baseUrl[0] + "order/cancel") //取消外卖订单
const updateOrder = post(baseUrl[0] + "order/status/update") //订单点击配送、完成-外卖
const getTangshiOrderList = get(baseUrl[0] + "order/list/tangshi") //堂食订单列表
const getTangshiOrderDetail = get(baseUrl[0] + "order/detail/tangshi") //堂食订单详情
const completeOrder = post(baseUrl[0] + "order/complete") //堂食结单
const printOrder = get(baseUrl[0] + "order/print") //打印订单

const getDeviceStatistics = get(baseUrl[1] + 'system/api/storeDeviceStatistics')
const getDeviceListByStoreId = get(baseUrl[1] + 'system/api/getDeviceListByStoreId')
const updateDeviceTableNum = post(baseUrl[1] + 'system/api/updateDeviceTableNum')

const updateImage = upload(baseUrl[1] + 'upload/upimage')
const advertPut = post(baseUrl[1] + 'system/api/advertPut')
const getAdvertByMac = get(baseUrl[1] + 'system/api/getAdvertByMac')

const getProductList = get(baseUrl[0] + '../category/product/list')

export {
    login,
    getOrderCount,
    getWaimaiOrderList,
    getWaimaiOrderDetail,
    getTangshiOrderList,
    getTangshiOrderDetail,
    cancelOrder,
    updateOrder,
    completeOrder,
    printOrder,
    getDeviceStatistics,
    getDeviceListByStoreId,
    updateDeviceTableNum,
    updateImage,
    advertPut,
    getAdvertByMac,
    getProductList,
}