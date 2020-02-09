// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

function getDateTime(ts) {
  var timezone = 8; //目标时区时间，东八区

  var now = new Date(ts*1000 + timezone * 60 * 60 * 1000);

  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var date = now.getDate();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();
  return year + "-" + month + "-" + date;
}

function getMinuteTime(ts) {
  var timezone = 8; //目标时区时间，东八区

  var now = new Date(ts*1000 + timezone * 60 * 60 * 1000);
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var date = now.getDate();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();
  return hour + ":" + minute
}


// 云函数入口函数
exports.main = async (event, context) => {
  let weRunStepReal = 0;
  let weRunStepFake = 0;
  let calorie=0;

  let stepArray = event.weRunData.data.stepInfoList
  // 
  let openid = event.userInfo.openId

  // 当日当时步数
  weRunStepReal = stepArray[stepArray.length - 1].step

  
  let timestamp = stepArray[stepArray.length - 1].timestamp
  // 2012-2-10
  let nowDate = getDateTime(timestamp)
  // 10:30
  let nowMinute = getMinuteTime(timestamp)


 
  let dataList = await db.collection('user').where({
    openid: openid,
  }).get();

  dataList = dataList.data[0]
  if (!dataList.weRunList) {
    dataList.weRunList = {};
  }
  if (dataList.weRunList[nowDate]){

  }
  else {
    dataList.weRunList[nowDate] = {}
  }

  dataList.weRunList[nowDate].totalStep = weRunStepReal
  // 此时不存在这个点才回保存
  if (!dataList.weRunList[nowDate][nowMinute]) {
    dataList.weRunList[nowDate][nowMinute] = {
      guess: 0,
      weRunStepReal: weRunStepReal,
      weRunStepFake: weRunStepFake,
      calorie: calorie
    }
  }

  let a = await db.collection('user')
    .where({
      openid: openid
    }).update({
      data: {
        weRunList: dataList.weRunList
      }
    })

  

  return {
    dataList,
    stepArray
  }
}