// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let weRunStepTodayReal = 0;
  let weRunStepTodayFake = 0;
  let timestamp;
  let stepArray = event.weRunData.data.stepInfoList


  weRunStepTodayReal = stepArray[stepArray.length - 1].step
  timestamp = stepArray[stepArray.length - 1].timestamp

  let dateObj = new Date(timestamp)
  let dateNowDay = dateObj.getDate()


  return {
    weRunStepTodayReal,
    dateNowDay
  }
}