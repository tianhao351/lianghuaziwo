// 云函数入口文件
const cloud = require('wx-server-sdk')

let Random =  function (min, max) {
  return Math.round(Math.random() * (max - min)) + min;
}


let shifenwei = function (num) {
  return parseInt((num * 10) % 10);
}

let gewei = function (num) {
  return  parseInt(num % 10);
}

let shiwei = function (num) {
  return parseInt((num % 100) / 10);
}

let baiwei = function (num) {
  return parseInt((num % 1000) / 100);
}

let qianwei = function (num) {
  return parseInt((num % 10000) / 1000);
}

let wanwei = function (num) {
  return parseInt((num % 100000) / 10000);
}

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

  var now = new Date(ts + timezone * 60 * 60 * 1000);
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
  let calorieFake = 0;



  

  let stepArray = event.weRunData.data.stepInfoList
  // 
  let openid = event.userInfo.openId

  // 当日当时步数
  weRunStepReal = stepArray[stepArray.length - 1].step

  
  let timestamp = stepArray[stepArray.length - 1].timestamp
  let serverTime = Date.parse(new Date());
  // 2012-2-10
  let nowDate = getDateTime(timestamp)
  // 10:30
  let nowMinute = getMinuteTime(serverTime)


 
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





  // 计算卡路里
  let bupin = 0;
  if (dataList.userHealthy.sex === 1) {
    bupin = 112.2
  }
  else if (dataList.userHealthy.sex === 2) {
    bupin = 123.4
  }
  else {
    return "errMeg: sex wrong"
  }

  calorie = 0.43 * dataList.userHealthy.height + 0.57 * dataList.userHealthy.weight + 0.26 * bupin + 0.92 * (weRunStepReal * 1.16 / 60) - 108.44


  dataList.weRunList[nowDate].totalCalorie = calorie
  // 计算fake
  // 凑整&明确
  if (dataList.exp === 'clear+round') {
    if (weRunStepReal >= 0 && weRunStepReal < 100) {
      weRunStepFake = shiwei(weRunStepReal) * 10 + Random(5, 9)
    }

    else if (weRunStepReal >= 100 && weRunStepReal < 1000) {
      if (shiwei(weRunStepReal) <= 4) {
        weRunStepFake = (baiwei(weRunStepReal) - 1) * 100 + Random(7, 9) * 10 + Random(5, 9)
      }
      else {
        weRunStepFake = (baiwei(weRunStepReal)) * 100 + Random(7, 9) * 10 + Random(5, 9)
      }
    }

    else if (weRunStepReal >= 1000 && weRunStepReal < 10000) {
      if (baiwei(weRunStepReal) <= 4) {
        weRunStepFake = (qianwei(weRunStepReal) - 1) * 1000 + Random(7, 9) * 100 + Random(5, 9) * 10 + Random(5, 9)
      }
      else {
        weRunStepFake = (qianwei(weRunStepReal)) * 1000 + Random(7, 9) * 100 + Random(5, 9) * 10 + Random(5, 9)
      }
    }

    else if (weRunStepReal >= 10000 && weRunStepReal < 100000) {
      if (qianwei(weRunStepReal) <= 4) {
        weRunStepFake = (wanwei(weRunStepReal) - 1) * 10000 + Random(7, 9) * 1000 + Random(5, 9) * 100 + Random(5, 9) * 10 + Random(5, 9)
      }
      else {
        weRunStepFake = (wanwei(weRunStepReal)) * 10000 + Random(7, 9) * 1000 + Random(5, 9) * 100 + Random(5, 9) * 10 + Random(5, 9)
      }
    }
    else if (weRunStepReal >= 100000 && weRunStepReal < 1000000) {
      weRunStepFake = weRunStepReal
    }
  }


  // 凑整&不明确
  if (dataList.exp === 'Nclear+round') {
    if (calorie >= 0 && calorie < 1) {
      calorieFake = shifenwei(calorie) * 0.1 + Random(7, 9) * 0.01
    }

    else if (calorie >= 1 && calorie < 10) {
      if (shifenwei(calorie) <= 4) {
        calorieFake = (gewei(calorie) - 1) + Random(7, 9) * 0.1 + Random(5, 9) * 0.01
      }
      else {
        calorieFake = (gewei(calorie)) + Random(7, 9) * 0.1 + Random(5, 9) * 0.01
      }
    }

    else if (calorie >= 10 && calorie < 100) {
      if (gewei(calorie) <= 4) {
        calorieFake = (shiwei(calorie) - 1) * 10 + Random(7, 9) + Random(5, 9) * 0.1 + Random(5, 9) * 0.01
      }
      else {
        calorieFake = (shiwei(calorie)) * 10 + Random(7, 9) + Random(5, 9) * 0.1 + Random(5, 9) * 0.01
      }
    }

    else if (calorie >= 100 && calorie < 1000) {
      if (shiwei(calorie) <= 4) {
        calorieFake = (baiwei(calorie) - 1) * 100 + Random(7, 9) * 10 + Random(5, 9) + Random(5, 9) * 0.1 + Random(5, 9) * 0.01
      }
      else {
        calorieFake = (baiwei(calorie)) * 100 + Random(7, 9) * 10 + Random(5, 9) + Random(5, 9) * 0.1 + Random(5, 9) * 0.01
      }
    }
    else if (calorie >= 1000 && calorie < 1000000) {
      calorieFake = calorie
    }
  }


  // 非凑整&明确
  if (dataList.exp === 'clear+Nround') {
    if (weRunStepReal >= 0 && weRunStepReal < 100) {
      if (shiwei(weRunStepReal) == 9) {
        weRunStepFake = 100 + Random(0, 2)
      }
      else {
        weRunStepFake = (shiwei(weRunStepReal)) * 10 + Random(0, 2)
      }
    }

    else if (weRunStepReal >= 100 && weRunStepReal < 1000) {
      if (baiwei(weRunStepReal) == 8 || baiwei(weRunStepReal) == 9) {
        weRunStepFake = 1000 + Random(0, 5) * 10 + Random(0, 2)
      }
      else if (shiwei(weRunStepReal) <= 6) {
        weRunStepFake = (baiwei(weRunStepReal)) * 100 + Random(0, 5) * 10 + Random(0, 2)
      }
      else {
        weRunStepFake = (baiwei(weRunStepReal) + 1) * 100 + Random(0, 5) * 10 + Random(0, 2)
      }
    }

    else if (weRunStepReal >= 1000 && weRunStepReal < 10000) {
      if (qianwei(weRunStepReal) == 8 || qianwei(weRunStepReal) == 9) {
        weRunStepFake = 10000 + Random(0, 5) * 100 + Random(0, 2) * 10 + Random(0, 2)
      }
      else if (baiwei(weRunStepReal) <= 6) {
        weRunStepFake = (qianwei(weRunStepReal)) * 1000 + Random(0, 5) * 100 + Random(0, 2) * 10 + Random(0, 2)
      }
      else {
        weRunStepFake = (qianwei(weRunStepReal) + 1) * 1000 + Random(0, 5) * 100 + Random(0, 2) * 10 + Random(0, 2)
      }
    }

    else if (weRunStepReal >= 10000 && weRunStepReal < 100000) {
      if (wanwei(weRunStepReal) == 8 || wanwei(weRunStepReal) == 9) {
        weRunStepFake = 100000 + Random(0, 5) * 1000 + Random(0, 2) * 100 + Random(0, 2) * 10 + Random(0, 2)
      }
      else if (qianwei(weRunStepReal) <= 6) {
        weRunStepFake = (wanwei(weRunStepReal)) * 10000 + Random(0, 5) * 1000 + Random(0, 2) * 100 + Random(0, 2) * 10 + Random(0, 2)
      }
      else {
        weRunStepFake = (wanwei(weRunStepReal) + 1) * 10000 + Random(0, 5) * 1000 + Random(0, 2) * 100 + Random(0, 2) * 10 + Random(0, 2)
      }
    }
    else if (weRunStepReal >= 100000 && weRunStepReal < 1000000) {
      weRunStepFake = weRunStepReal
    }
  }

  // 非凑整&不明确
  if (dataList.exp === 'Nclear+Nround') {
    if (calorie >= 0 && calorie < 1) {
      if (shifenwei(calorie) == 9) {
        calorieFake = 1 + Random(0, 2) * 0.01
      }
      else {
        calorieFake = (shifenwei(calorie)) * 0.1 + Random(0, 2) * 0.01
      }
    }

    else if (calorie >= 1 && calorie < 10) {
      if (gewei(calorie) == 8 || gewei(calorie) == 9) {
        calorieFake = 10 + Random(0, 5) * 0.1 + Random(0, 2) * 0.01
      }
      else if (shifenwei(calorie) <= 6) {
        calorieFake = (gewei(calorie)) + Random(0, 5) * 0.1 + Random(0, 2) * 0.01
      }
      else {
        calorieFake = (gewei(calorie) + 1) + Random(0, 5) * 0.1 + Random(0, 2) * 0.01
      }
    }

    else if (calorie >= 10 && calorie < 100) {
      if (shiwei(calorie) == 8 || shiwei(calorie) == 9) {
        calorieFake = 100 + Random(0, 5) + Random(0, 2) * 0.1 + Random(0, 2) * 0.01
      }
      else if (gewei(calorie) <= 6) {
        calorieFake = (shiwei(calorie)) * 10 + Random(0, 5) + Random(0, 2) * 0.1 + Random(0, 2) * 0.01
      }
      else {
        calorieFake = (shiwei(calorie) + 1) * 10 + Random(0, 5) + Random(0, 2) * 0.1 + Random(0, 2) * 0.01
      }
    }

    else if (calorie >= 100 && calorie < 1000) {
      if (baiwei(calorie) == 8 || baiwei(calorie) == 9) {
        calorieFake = 1000 + Random(0, 5) * 10 + Random(0, 2) + Random(0, 2) * 0.1 + Random(0, 2) * 0.01
      }
      else if (shiwei(calorie) <= 6) {
        calorieFake = (baiwei(calorie)) * 100 + Random(0, 5) * 10 + Random(0, 2) + Random(0, 2) * 0.1 + Random(0, 2) * 0.01
      }
      else {
        calorieFake = (baiwei(calorie) + 1) * 100 + Random(0, 5) * 10 + Random(0, 2) + Random(0, 2) * 0.1 + Random(0, 2) * 0.01
      }
    }
    else if (calorie >= 100000 && calorie < 1000000) {
      calorieFake = calorie
    }
  }



  // 此时不存在这个点才回保存
  if (!dataList.weRunList[nowDate][nowMinute]) {
    dataList.weRunList[nowDate][nowMinute] = {
      guess: 0,
      weRunStepReal: weRunStepReal,
      weRunStepFake: weRunStepFake,
      calorie: calorie,
      calorieFake: calorieFake
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
    stepArray,
    exp: dataList.exp
  }
}