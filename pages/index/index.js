import service from '../../services/service';
import storage from "../../utils/storage";
const app = getApp();

Page({
    data: {
        top: 0,
        step: 1,
        gender: 0,
        age: 0,
        height: 0,
        weight: 0,
        phone: 0,
        experience: -1,
        experiences: ['现在保持健身/运动的习惯', '之前有过健身/运动经历，现在停滞了', '一直都没有以一定的频率健身/运动']
    },

    onLoad: function () {
        this.choices = new Array(10).fill(-1);
    },

    setGender(e) {
        const { gender } = e.target.dataset;
        this.setData({
            gender: +gender
        });
    },

    setAge(e) {
        const { value } = e.detail;
        this.setData({
            age: +value
        });
    },

    setHeight(e) {
        const { value } = e.detail;
        this.setData({
            height: +value
        });
    },

    setWeight(e) {
        const { value } = e.detail;
        this.setData({
            weight: +value
        });
    },

    setPhone(e) {
        const { value } = e.detail;
        this.setData({
            phone: +value
        });
    },

    setExperience(e) {
        const { value } = e.detail;
        this.setData({
            experience: +value
        });
    },

    next() {
        const { step } = this.data;
        switch(step) {
            case 1: {
                if (this.validateBasicInfo()) {
                    this.setData({ step: 2, top: 0 });
                }
                break;
            }
            case 2:
            default: {
                const emptyIndex = this.choices.findIndex(choice => choice === -1);
                if (emptyIndex === -1) {
                    // 保存用户记录
                    const { age, gender, height, weight, phone, experience } = this.data;
                    const { openid } = app.globalData;
                    const data = {
                        userInfo: {},
                        openid,
                        sex: gender,
                        age,
                        height,
                        weight,
                        phone,
                        experience
                    };
                    const answerData = {
                        openid,
                        answer: this.choices
                    };
                    service.saveUserInfo(data).then(() => {
                        // 适配服务端结构
                        const saveData = {
                            openid,
                            userInfo: {},
                            userHealthy: {
                                sex: gender,
                                age,
                                height,
                                weight,
                                phone,
                                experience
                            }
                        };
                        app.globalData.userInfo = saveData;
                        storage.set('user_info', saveData);
                        service.saveUserAnswers(answerData).then(() => {
                            wx.redirectTo({
                                url: '/pages/main/main?first=1'
                            });
                        });
                    }).catch(() => {
                        this.showToast('请求失败，请稍后重试！');
                    });
                } else {
                    this.showToast(`第${emptyIndex + 1}项内容没有选择`);
                }
                break;
            }
        }
    },

    validateBasicInfo() {
        const { gender, age, height, weight, phone, experience } = this.data;
        if (!gender) {
            this.showToast('请选择性别');
            return false;
        }
        if (!age) {
            this.showToast('请输入年龄');
            return false;
        }
        if (!height) {
            this.showToast('请输入身高');
            return false;
        }
        if (!weight) {
            this.showToast('请输入体重');
            return false;
        }
        if (!phone) {
            this.showToast('请输入手机号');
            return false;
        }
        if (!/^[1][3,4,5,7,8,9][0-9]{9}$/.test(phone)) {
            this.showToast('请输入正确的手机号');
            return false;
        }
        if (experience < 0) {
            this.showToast('请选择运动经历');
            return false;
        }
        return true;
    },

    showToast(message) {
        wx.showToast({
            title: message,
            icon: 'none'
        });
    },

    radioChange(e) {
        const { index } = e.target.dataset;
        const { value } = e.detail;
        this.choices[+index] = value;
    }
})
