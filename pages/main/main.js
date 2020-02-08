import service from "../../services/service";
import storage from "../../utils/storage";
const app = getApp();

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
})