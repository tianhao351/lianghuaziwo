import service from "../../services/service";
import storage from "../../utils/storage";
import { getType } from "../../utils/helper";
const app = getApp();

Page({
    data: {
        userInfo: {},
        activeIndex: 1,
        showMask: false,
        info: null,
        needGuessStep: false
    },

    onLoad(options) {
        const { userInfo } = app.globalData;
        const { first } = options;
        if (userInfo) {
            this.setStepInfo();
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
                        this.setStepInfo();
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

    setStepInfo() {
        wx.getWeRunData({
            success: (res) => {
                service.getWxRunDataList(res.cloudID).then(data => {
                    const { exp, dataList: { weRunList } } = data;
                    const type = getType(exp);
                    const list = Object.keys(weRunList);
                    const key = list.pop();
                    const info = {
                        type,
                        value: type ? weRunList[key].totalCalorie.toFixed(2) : weRunList[key].totalStep,
                        desc: type ? '千卡' : '步',
                        date: key,
                        remark: weRunList[key].remark || '',
                        desc2: type ? '猜猜截止到目前，你通过步行一共消耗了多少热量？' : '猜猜截止目前，你一共走了多少步？'
                    };
                    if (list.length <= 14) {
                        // 纯展示逻辑，拿到今天的那条数据
                        this.setData({
                            info: {
                                ...info,
                                showInputStep: true
                            }
                        });
                    } else if (list.length <= 21) {
                        // 15 - 21 天需要预估步数信息
                        this.setData({
                            info: {
                                ...info,
                                showInputStep: true
                            }
                        });
                    } else {
                        this.setData({
                            info: {
                                ...info,
                                showFinishToast: true
                            }
                        })
                    }
                });
            }
        });
    },
});