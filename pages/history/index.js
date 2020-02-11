import service from '../../services/service';
import { getType } from "../../utils/helper";
const app = getApp();

Page({
    data: {
        list: null
    },

    onLoad() {
        wx.getWeRunData({
            success: (res) => {
                service.getWxRunDataList(res.cloudID).then(data => {
                    const { exp, dataList: { weRunList } } = data;
                    const type = getType(exp);
                    const list = Object.keys(weRunList).map((key, index) => {
                        return {
                            week: this.getWeek(index),
                            day: this.getDay(index),
                            type,
                            value: type ? weRunList[key].totalCalorie.toFixed(2) : weRunList[key].totalStep,
                            desc: type ? '千卡' : '步',
                            date: key,
                            remark: weRunList[key].remark || ''
                        };
                    });
                    this.setData({ list });
                });
            }
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
        const activeData = this.data.list[+index];
        app.globalData.historyData = activeData;
        wx.navigateTo({ url: '/pages/detail/index' });
    }
});