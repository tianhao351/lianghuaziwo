import service from '../../services/service';
const app = getApp();

Component({
    properties: {
        info: {
            type: Object,
            value: {}
        }
    },
    data: {
        desc: '',
        showMask: false,
        showAddDesc: false,
        showInputStep: false,
        predictStep: 0,
        text: '',
        textClass: ''
    },
    attached() {
        if (this.data.info) {
            const { firstIn } = app.globalData;
            this.setData({
                desc: this.data.info.remark,
                showInputStep: !!this.data.info.showInputStep && firstIn,
                showMask: !!this.data.info.showInputStep && firstIn
            });
        }
    },
    observers: {
        'info': function(info) {
            if (info) {
                this.setData({
                    desc: info.remark,
                    showInputStep: !!info.showInputStep,
                    showMask: !!info.showInputStep
                });
                if (info.showFinishToast) {
                    this.showFinishToast();
                }
            }
        }
    },
    methods: {
        addDesc() {
            this.setData({ showMask: true, showAddDesc: true });
        },

        changeDescIndex(e) {
            const { value } = e.detail;
            switch (+value) {
                case 0:
                    this.setData({ desc: '今天临时有事情，较往常多走了一些路' });
                    break;
                case 1:
                    this.setData({ desc: '今天不舒服，或长时间开会，较往常少走了一些路' });
                    break;
                default:
                    break;
            }
        },

        onReasonChange(e) {
            const { value } = e.detail;
            this.setData({ desc: value });
        },

        closeDesc() {
            const data = {
                openid: app.globalData.userInfo.openid,
                date: this.data.info.date,
                remark: this.data.desc
            };
            this.setData({ showMask: false, showAddDesc: false });
            service.saveUserRemark(data).then(() => {});
        },

        onStepChange(e) {
            const { value } = e.detail;
            this.setData({ predictStep: +value });
        },

        showFinishToast() {
            wx.showModal({
                title: '完成提醒',
                content: '实验已经进行完毕，\n感谢你21天以来的配合',
                showCancel: false,
                confirmText: '知道了'
            });
        },

        onSubmitPredictStep() {
            const now = new Date();
            const hour = now.getHours();
            const minute = now.getMinutes();
            const { info: { date, value }, predictStep } = this.data;
            const data = {
                openid: app.globalData.userInfo.openid,
                date,
                guess: predictStep,
                time: `${hour}:${minute}`
            };
            const { type } = this.data;
            let text = '';
            let textClass = '';
            const num = +value;
            if (num > predictStep) {
                const delta = num - predictStep;
                text = type ? `比你预估的热量多${delta}千卡` : `比你预估的步数多${delta}步`;
                textClass = 'green';
            } else if (num < predictStep) {
                const delta = predictStep - num;
                text = type ? `比你预估的热量少${delta}千卡` : `比你预估的步数少${delta}步`;
                textClass = 'red';
            } else {
                text = type ? '和你预估的热量相等' : `和你预估的步数相等${predictStep}`;
            }
            app.globalData.firstIn = false;
            this.setData({
                showMask: false,
                showInputStep: false,
                text,
                textClass
            });
            service.saveGuessStep(data).then(() => {});
        }
    }
});
