import service from '../../services/service';
const app = getApp();

Page({
    data: {
        data: []
    },

    onLoad() {
        wx.getWeRunData({
            success(res) {
                service.getWxRunDataList(res.cloudID).then(data => {
                    console.log(data);
                });
            }
        });
        const data = [542.23, 23.14, 154.14];
        this.setData({
            data: this.parseData(data)
        });
    },

    parseData(data) {
        return data.map((value, index) => {
            return {
                week: this.getWeek(index),
                day: this.getDay(index),
                value
            };
        });
    },

    getWeek(index) {
        return Math.floor(index / 7) + 1;
    },

    getDay(index) {
        return index % 7 + 1;
    },

    openDetail(e) {
        const { dataset: { index } } = e.target;
        const activeData = this.data.data[+index];
        app.globalData.historyData = activeData;
        wx.navigateTo({ url: '/pages/detail/index' });
    }
});