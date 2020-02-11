export default {
    request(name, data = {}) {
        return new Promise((resolve, reject) => {
            wx.cloud.callFunction({
                name,
                data,
                success(res) {
                    resolve(res.result);
                },
                fail(e) {
                    reject(e);
                }
            });
        });
    },

    getWxUserInfo() {
        return this.request('getOpenid');
    },

    getUserInfo(openid) {
        return this.request('getUserInfo', { openid });
    },

    saveUserInfo(userInfo) {
        return this.request('saveUser', userInfo);
    },

    getWxRunDataList(cloudId) {
        return this.request('getWeRun', {
            weRunData: wx.cloud.CloudID(cloudId)
        });
    },

    saveUserAnswers(data) {
        return this.request('saveAnswer', data);
    },

    saveUserRemark(data) {
        return this.request('saveWerunRemark', data);
    },

    saveGuessStep(data) {
        return this.request('saveGuessStep', data);
    }
};
