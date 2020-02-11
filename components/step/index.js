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
        textClass: '',
        displayValue: '',
        displayDesc: ''
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
                const { firstIn, text, textClass } = app.globalData;
                const needShowDialog = (!!info.showInputStep) && firstIn;
                this.setData({
                    desc: info.remark,
                    showInputStep: needShowDialog,
                    showMask: needShowDialog,
                    displayValue: needShowDialog ? '' : info.value,
                    displayDesc: needShowDialog ? '' : info.desc,
                    text: !!info.showInputStep ? text : '',
                    textClass: !!info.showInputStep ? textClass : ''
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
                    this.saveDesc('今天临时有事情，较往常多走了一些路');
                    break;
                case 1:
                    this.saveDesc('今天不舒服，或长时间开会，较往常少走了一些路');
                    break;
                default:
                    break;
            }
        },

        onReasonChange(e) {
            const { value } = e.detail;
            this.saveDesc(value);
        },

        saveDesc(desc) {
            const data = {
                openid: app.globalData.userInfo.openid,
                date: this.data.info.date,
                remark: desc
            };
            service.saveUserRemark(data).then(() => {
                app.globalData.needFreshData = true;
            });
            setTimeout(() => {
                this.setData({
                    showMask: false,
                    showAddDesc: false,
                    desc
                });
            }, 300);
        },

        closeDesc() {
            this.setData({ showMask: false, showAddDesc: false });
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

        closeMask() {
            this.setData({
                showMask: false,
                showAddDesc: false,
                showInputStep: false
            });
        },

        onSubmitPredictStep() {
            const { info: { date, value, type, desc }, predictStep } = this.data;
            if (!predictStep) {
                wx.showToast({ icon: 'none', title: '请输入预测信息' });
                return;
            }
            const now = new Date();
            const hour = now.getHours();
            const minute = now.getMinutes();
            const data = {
                openid: app.globalData.userInfo.openid,
                date,
                guess: predictStep,
                time: `${hour}:${minute}`
            };
            let text = '';
            let textClass = '';
            const num = +value;
            if (num > predictStep) {
                const delta = num - predictStep;
                text = type ? `比你预估的热量多${delta.toFixed(2)}千卡` : `比你预估的步数多${delta}步`;
                textClass = 'green';
            } else if (num < predictStep) {
                const delta = predictStep - num;
                text = type ? `比你预估的热量少${delta.toFixed(2)}千卡` : `比你预估的步数少${delta}步`;
                textClass = 'red';
            } else {
                text = type ? '和你预估的热量相等' : `和你预估的步数相等${predictStep}`;
            }
            app.globalData.firstIn = false;
            app.globalData.text = text;
            app.globalData.textClass = textClass;
            this.setData({
                showMask: false,
                showInputStep: false,
                text,
                textClass,
                displayValue: value,
                displayDesc: desc
            });
            service.saveGuessStep(data).then(() => {});
        }
    }
});
