Page({
    data: {},

    preview() {
        wx.previewImage({ urls: ['https://conan-online.fbcontent.cn/conan-oss-resource/zebra-15795999016013495.jpg'] });
    },

    copy() {
        wx.setClipboardData({ data: 'li_andyi' });
    }
})