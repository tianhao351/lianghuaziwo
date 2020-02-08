import service from '../../services/service';
import storage from '../../utils/storage';
const app = getApp();

Page({
    data: {
        userInfo: {},
        sex: 1,
        age: 0,
        height: 0,
        weight: 0,
        phone: 0,
        experience: 0,
        experiences: ['现在保持健身/运动的习惯', '之前有过健身/运动经历，现在停滞了', '一直都没有以一定的频率健身/运动']
    },

    onLoad() {
        // to be replaced
        const { userInfo } = app.globalData;
        const { sex, age = 26, height, weight, phone, experience = '' } = userInfo.userHealthy;
        this.setData({
            userInfo: userInfo.userInfo,
            sex,
            age,
            height,
            weight,
            phone,
            experience
        });
    },

    setPhone(e) {
        const { value } = e.detail;
        this.setData({
            phone: +value
        });
    },

    save() {
        const openid = app.globalData;
        const { userInfo, sex, age, height, weight, phone, experience } = this.data;
        const data = {
            openid,
            userInfo,
            sex,
            age,
            height,
            weight,
            phone,
            experience
        };
        service.saveUserInfo(data).then(() => {
            app.globalData.userInfo.userHealthy.phone = phone;
            storage.set('user_info', app.globalData.userInfo);
            wx.navigateBack();
        });
    }
});