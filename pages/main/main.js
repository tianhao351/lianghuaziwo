import service from "../../services/service";
import storage from "../../utils/storage";
const app = getApp();

let openid = '';


Page({
    data: {
        userInfo: {},
        activeIndex: 1,
        showMask: false,
    },

    onLoad(options) {
        const { userInfo } = app.globalData;
        const { first } = options;
        if (userInfo) {
            this.setData({
                userInfo: userInfo.userInfo,
                showMask: !!first
            });
        } else {
            // 先获取微信 openId 信息
            service.getWxUserInfo().then(wxUserInfo => {
                app.globalData.openid = wxUserInfo.openid;
                service.getUserInfo(wxUserInfo.openid).then(userInfo => {
                    if (userInfo && userInfo.data.length) {
                        app.globalData.userInfo = userInfo.data[0];
                        storage.set('user_info', userInfo.data[0]);
                        this.setData({
                            userInfo: userInfo.data[0].userInfo,
                            showMask: !!first
                        });
                    } else {
                        wx.redirectTo({ url: '/pages/index/index' });
                    }
                });
            });
        }
    },

    setActiveIndex(e) {
        const { index } = e.target.dataset;
        this.setData({
            activeIndex: +index
        });
    },

    closeMask() {
        this.setData({ showMask: false });
    },

    openPersonal() {
        wx.navigateTo({ url: '/pages/personal/index' });
    },

    openHistory() {
        wx.navigateTo({ url: '/pages/history/index' });
    },

    openFeedback() {
        wx.navigateTo({ url: '/pages/feedback/index' });
    },






  saveAnswer() {
    openid = app.globalData.openid
    wx.cloud.callFunction({
      name: "saveAnswer",
      data: {
        openid: 'opZ9a5MKNG51Hg-FemHBkmnqx92I',
        answer: [1,2,3,3,1,2,1,3,3,3,3]
      },
      success(res) {
        console.log('saveAnswer', res)
      },
      fail: console.error
    })
  },



  saveGuessStep() {
  console.log(app.globalData.openid)
  wx.cloud.callFunction({
    name: "saveGuessStep",
    data: {
      openid: 'opZ9a5MKNG51Hg-FemHBkmnqx92I',
      date: '2020-2-11',
      guess: 8888,
      time: '21:42'
    },
    success(res) {
      console.log('getopenid', res)
    },
    fail: console.error
  })
},
})