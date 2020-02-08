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

    // addUserRunRecord(record) {
    //     return this.mockPromise(record);
    // },
    //
    // updateUserRunRecord(record) {
    //     return this.mockPromise(record);
    // },
    //
    // getUserRunRecordList(openId) {
    //     const reocrdList = [{
    //         timestamp: 1580486400000,
    //         step: 8000,
    //         ca: 1255.75,
    //         desc: ''
    //     }, {
    //         timestamp: 1580572800000,
    //         step: 12000,
    //         ca: 1800.66,
    //         desc: '备注了一下子'
    //     }];
    //     return this.mockPromise(reocrdList);
    // },
    //
    // saveUserAnswers(answers) {
    //     return this.mockPromise(answers);
    // }
};
