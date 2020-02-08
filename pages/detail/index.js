const app = getApp();

Page({
    data: {
        step: ''
    },

    onLoad() {
        const { historyData } = app.globalData;
        const { week, day, value } = historyData;
        wx.setNavigationBarTitle({ title: `第 ${week} 周 第 ${day} 天` });
        this.setData({
            step: value
        });
    },
});