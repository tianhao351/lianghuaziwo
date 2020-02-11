// 云函数入口文件
const cloud = require('wx-server-sdk')

const exp = ['clear+round', 'Nclear+Nround', 'Nclear+round', 'clear+Nround']

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  let a = await db.collection('user').where({
    openid: event.openid,
  }).get();
  if (a && a.data && a.data.length > 0) {
    return {
      userInfo: a,
      errMsg: "the user is excited"
    }
  }
  else {


    return await db.collection('user').add({
      data: {
        // _id: 'test', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
        openid: event.openid,
        userInfo: event.userInfo,
        exp: exp[Math.floor(Math.random() * 10)],
        userHealthy: {
          height:event.height,
          weight:event.weight,
          sex:event.sex,
          phone:event.phone
        }
      },
      success: function (res) {
      }
    })
  }

}