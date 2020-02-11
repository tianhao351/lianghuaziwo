import storage from './utils/storage';

App({
    globalData: {
        userInfo: null,
        openid: '',
        firstIn: true,
        text: '',
        textClass: '',
        needFreshData: false
    },

    onLaunch: function () {
        wx.cloud.init({
            env: "lianghuaziwo-4je8i"
        });

        const userInfo = storage.get('user_info');
        if (userInfo) {
            // 本地缓存里有
            this.globalData.userInfo = userInfo;
        }
    }
});