//index.js
//获取应用实例
const app = getApp()

let openid = '';

wx.cloud.callFunction({
  name: "calculate",
  data: {
    a:1,
    b:5
  },
  success(res) {
    console.log(res)
  }
})




wx.cloud.callFunction({
  name: "getOpenid",
  success(res) {
    console.log('getopenid', res)
    openid = res.result.openid
  }
})

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log('xxx', res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          console.log('res.userInfo', res.userInfo)
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },






  bindSaveUser:function() {
    console.log('bindSaveUser',openid, this.data.userInfo)

    wx.cloud.callFunction({
      name: "saveUser",
      data: {
        userInfo:this.data.userInfo,
        openid: openid,
        height:170,
        weight:80,
        sex:1,
        phone:123123123
        }
        ,
      success(res) {
        console.log('saveUser', res)
      }
    })


    wx.cloud.callFunction({
      name: "getUserInfo",
      data: {
        openid:openid
      },
      success(res) {
        console.log('getUserInfo', res)
      }
    })

  },


  bindWeRun: function() {
    wx.getWeRunData({
      success(res) {
        const encryptedData = res.encryptedData
        const cloudID = res.cloudID

        wx.cloud.callFunction({
          name: 'getWeRun',
          data: {
            weRunData: wx.cloud.CloudID(cloudID), // 这个 CloudID 值到云函数端会被替换
          },
          success: function(res) {
            console.log('werunrRes', res)
          }
        })
      }
    })
  },








  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    console.log()
    this.setData({
      hasUserInfo: true
    })
  }
})
