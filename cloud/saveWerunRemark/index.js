// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()



// 云函数入口函数
exports.main = async (event, context) => {
  let openid = event.openid
  let remark = event.remark
  let date = event.date



  let dataList = await db.collection('user').where({
    openid: openid,
  }).get();


  dataList = dataList.data[0]

  if (!dataList.weRunList) {
    dataList.weRunList = {};
  }
  if (dataList.weRunList[date]) {
    dataList.weRunList[date].remark = remark
  }
  let b = dataList.weRunList[date]


  return await db.collection('user')
    .where({
      openid: openid
    }).update({
      data: {
        weRunList: dataList.weRunList
      }
    }) 
}