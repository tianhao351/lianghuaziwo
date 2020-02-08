Component({
    properties: {
        step: {
            type: Number,
            value: 0
        },
        hint: {
            type: String,
            value: ''
        }
    },
    data: {
        desc: '',
        showMask: false,
        showAddDesc: false,
        showInputStep: false,
        predictStep: 0
    },
    attached() {
        this.setData({
            desc: this.data.hint
        });

        // this.showFinishToast();
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

        onSubmitPredictStep() {
            this.setData({ showMask: false, showInputStep: false });
        }
    }
});
