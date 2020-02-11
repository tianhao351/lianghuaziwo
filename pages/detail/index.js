const app = getApp();

Page({
    data: {
        stepInfo: null
    },

    onLoad() {
        const { historyData } = app.globalData;
        const { week, day } = historyData;
        wx.setNavigationBarTitle({ title: `第 ${week} 周 第 ${day} 天` });
        this.setData({
            stepInfo: historyData
        });
    }
});